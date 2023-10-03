/*
 *    Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *    with the License. A copy of the License is located at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *    or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *    OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *    and limitations under the License.
 */

import { Octokit } from "octokit";
import dayjs from "dayjs";
import { execAsync } from "./shell";
import { DescribeStacksCommand, ListStacksCommand, ListStacksCommandOutput, StackSummary } from "@aws-sdk/client-cloudformation";
import { getCloudFormationClient } from "./awsClient";

const { SILENT_COMMAND_EXECUTION:isSilentStr } = process.env;
const isSilent = (isSilentStr) ? isSilentStr === "true": true ;

export interface Release {
    name: string;
    tag_name: string;
    created_at: string;
    published_at: string;
}

export interface SifMetadata {
    tag?: string;
    version?: string;
}

export type SifMetadataWithVersion = SifMetadata & { name: string }

export type SifTenantWithVersion = SifMetadata & { name: string, environment: string }

export interface StackMetadata {
    name?: string;
    status?: string;
}

export type ReleaseList = Release[];
const octokit = new Octokit();


const listReleases = async (): Promise<ReleaseList> => {
    const results = (await octokit.rest.repos.listReleases({ owner: process.env.REPO_OWNER!, repo: process.env.REPO_NAME! })).data.map(({ name, tag_name, created_at, published_at }) => {
        return { name, tag_name, created_at: dayjs(created_at).format("dddd, MMMM D, YYYY h:mm A"), published_at: dayjs(published_at).format("dddd, MMMM D, YYYY h:mm A") };
    });
    return results as ReleaseList;
};


const getTagByReleaseVersion = async (version: string): Promise<string | undefined> => {
    const results = await listReleases();
    return results.find(o => o.name === version)?.tag_name;
};

const listReleasesMock = async (): Promise<ReleaseList> => {
    return [
        {
            name: "v1.8.2",
            tag_name: "RELEASE-LIVE-20230728033512-92-g6bccb5a2",
            published_at: dayjs(Date.now()).toString(),
            created_at: dayjs(Date.now()).toString()
        },
        {
            name: "v1.7.0",
            tag_name: "RELEASE-LIVE-20230728033512-79-g82871a4b",
            published_at: dayjs(Date.now()).toString(),
            created_at: dayjs(Date.now()).toString()
        }];
};

// const getReleaseVersionByTag = async (tag: string): Promise<string | undefined> => {
// 	let result;
// 	try {
// 		result = (await octokit.rest.repos.getReleaseByTag({ owner: process.env.REPO_OWNER!, repo: process.env.REPO_NAME!, tag })).data;
// 	} catch (exception) {
// 		console.log(`Could not find release version that match tag ${tag}`);
// 	}
// 	return result?.name;
// };

const getReleaseVersionByTag = async (tag: string): Promise<string | undefined> => {
    return (await listReleasesMock()).find(o => o.tag_name === tag)?.name;
};

const inactiveStackStates = ["CREATE_IN_PROGRESS", "CREATE_FAILED", "DELETE_FAILED", "DELETE_IN_PROGRESS", "DELETE_COMPLETE"];
const listDeployedInstances = async (environment: string, roleArn?: string): Promise<SifTenantWithVersion[]> => {
    const sifTenantList: string[] = [];
    let nextToken: string | undefined = undefined;
	const cfClient = await getCloudFormationClient(roleArn);
    do {
        const stackList: ListStacksCommandOutput = await cfClient.send(new ListStacksCommand({ NextToken: nextToken }));

        nextToken = stackList.NextToken;
        // Get a list of tenants in our Environment
        if (stackList.StackSummaries) {
            const tenants = stackList.StackSummaries.filter((stack: StackSummary) =>
                String(stack.StackName).match(`sif-.*-${environment}-accessManagement`)
                && !inactiveStackStates.includes(stack.StackStatus as string)
                && stack.StackStatus)
                .map((stack: StackSummary) => (stack.StackName as string).split("-")[1]);
            sifTenantList.push(...tenants);
        }
    } while (nextToken);

    const describeTaskFutures = sifTenantList.map(tenant => {
        return cfClient.send(new DescribeStacksCommand({ StackName: `sif-${tenant}-${environment}-accessManagement` }))
            .then(async (r) => {
                const tag = r.Stacks?.[0].Tags?.find(o => o.Key === "sif:gitTag")?.Value;
                const version = r.Stacks?.[0].Tags?.find(o => o.Key === "sif:gitVersion")?.Value;
                return { version, tag, name:tenant, environment };
            });
    });

    const describeTaskResponse = await Promise.all(describeTaskFutures);
    return describeTaskResponse.map(o => o);
};

const listDeployedEnvironments = async (roleArn?: string): Promise<SifMetadataWithVersion[]> => {
    const environmentNamePattern = /^sif-shared\-(.*)\-platform$/;
    let keepGoing = true, nextToken: string | undefined = undefined;
    const sifEnvironmentList: string[] = [];
	const cfClient = await getCloudFormationClient(roleArn);
    while (keepGoing) {
        const listStackResponse: ListStacksCommandOutput = await cfClient.send(new ListStacksCommand({ NextToken: nextToken }));
        if (listStackResponse.NextToken) {
            nextToken = listStackResponse.NextToken;
        } else {
            keepGoing = false;
        }
        if (listStackResponse.StackSummaries) {
            sifEnvironmentList.push(...listStackResponse.StackSummaries
                .filter((o: StackSummary) =>
                    o.StackStatus && !inactiveStackStates.includes(o.StackStatus) && o.StackName?.match(environmentNamePattern))
                .map((o: StackSummary) => o.StackName as string));
        }
    }
    const describeTaskFutures = sifEnvironmentList.map(s => {
        return cfClient.send(new DescribeStacksCommand({ StackName: s }))
            .then(async (r) => {
                const name = r.Stacks?.[0].StackName?.replace(environmentNamePattern, "$1");
                const tag = r.Stacks?.[0].Tags?.find(o => o.Key === "sif:gitTag")?.Value;
                const version = r.Stacks?.[0].Tags?.find(o => o.Key === "sif:gitVersion")?.Value;
                return { version, tag, name: name! };
            });
    });

    const describeTaskResponse = await Promise.all(describeTaskFutures);
    return describeTaskResponse.map(o => o);
};

const getDeployedEnvironment = async (environment: string, tenantId?: string, roleArn?: string): Promise<SifMetadata> => {
    const stackName = (tenantId) ? `sif-${tenantId}-${environment}-accessManagement` : `sif-shared-${environment}-platform`;
	const cfClient = await getCloudFormationClient(roleArn);
    const result = await cfClient.send(new DescribeStacksCommand({ StackName: stackName }))
        .then(async (r) => {
            const tag = r.Stacks?.[0].Tags?.find(o => o.Key === "sif:gitTag");
            const version = r.Stacks?.[0].Tags?.find(o => o.Key === "sif:gitVersion");
            return { tag: tag?.Value, version: version?.Value };
        });
    return result;
};

const getLocalRepositoryVersion = async (): Promise<SifMetadata> => {
	try {
		const currentTag = (await execAsync("git describe --tags", { silent: isSilent })).trim();
		const version = await getReleaseVersionByTag(currentTag);
		return { tag: currentTag, version };
	} catch (error) {
		console.log("Could not find any tag or version information is the repository");
		return {};
	}
};


const getDeployedStackByName= async (stackName: string, roleArn?: string): Promise<StackMetadata> => {
	const cfClient = await getCloudFormationClient(roleArn);
    const result = await cfClient.send(new DescribeStacksCommand({ StackName: stackName }))
	.then(async (r) => {
		const stackName = r.Stacks?.[0].StackName;
		const stackStatus = r.Stacks?.[0].StackStatus;
		return { name: stackName, status:stackStatus };
	});
    return result;
};

export {
    listReleases,
    getReleaseVersionByTag,
    getLocalRepositoryVersion,
    getTagByReleaseVersion,
    getDeployedEnvironment,
    listDeployedEnvironments,
    listDeployedInstances,
	getDeployedStackByName
};
