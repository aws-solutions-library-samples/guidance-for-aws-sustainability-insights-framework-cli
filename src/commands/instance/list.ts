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

import { Command, Flags } from "@oclif/core";
import { CloudFormationClient, ListStacksCommand, ListStacksCommandOutput, StackSummary, DescribeStacksCommand, DescribeStacksCommandOutput, DescribeStacksCommandInput, Tag } from "@aws-sdk/client-cloudformation";
import { table } from "table";

export class InstanceList extends Command {
	public static description = "Lists all deployed tenants within a specific environment";
	public static flags = {
		environment: Flags.string(
			{
				char: "e",
				required: true,
				description: "An environment represents an isolated deployment of tenantId(s)",
			}
		),
		region: Flags.string(
			{
				char: "r",
				description: "Region used for listing of sif tenants",
			}
		)
	};

	public static examples = [
		"<%= config.bin %> <%= command.id %> -t demo -e prod -r us-west-2 -a 1234567",
	];

	private inactiveStackStates = ["CREATE_IN_PROGRESS", "CREATE_FAILED", "DELETE_FAILED", "DELETE_IN_PROGRESS", "DELETE_COMPLETE"];

	public async run(): Promise<string[]> {
		const { flags } = await this.parse(InstanceList);

		const region = flags.region ?? process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION;

		if (!region) {
			throw new Error("No region specified in the environment variable AWS_REGION or AWS_DEFAULT_REGION or using the -r argument");
		}

		const cloudformation = new CloudFormationClient({ region });
		const sifTenantList:string[] = [];
		const sifTenantTable =[["TenantId","Environment","GitBranch","GitTag","GitRevision"]];
		let nextToken:string|undefined = undefined;
		do {
			const stackList:ListStacksCommandOutput = await cloudformation.send(new ListStacksCommand({ NextToken: nextToken }));

			nextToken = stackList.NextToken;
			// Get a list of tenants in our Environment
			if(stackList.StackSummaries){
				const tenants = stackList.StackSummaries.filter((stack:StackSummary) =>
					String(stack.StackName).match(`sif-.*-${flags.environment}-accessManagement`)
					&& !this.inactiveStackStates.includes(stack.StackStatus as string)
					&& stack.StackStatus)
					.map((stack:StackSummary) => (stack.StackName as string).split("-")[1]);
				sifTenantList.push(...tenants);
			}
		} while(nextToken);

		// Add deployment metadata to the tenant
		for(const tenant of sifTenantList){
			const input:DescribeStacksCommandInput = { StackName:`sif-${tenant}-${flags.environment}-accessManagement` };
			const stackDescription:DescribeStacksCommandOutput = await cloudformation.send(new DescribeStacksCommand(input));
			const tags = stackDescription.Stacks?.[0].Tags;
			const branch = tags?.find((tag:Tag) => tag.Key === "sif:gitBranch" )?.Value!;
			const gitTag = tags?.find((tag:Tag) => tag.Key === "sif:gitTag" )?.Value!;
			const revision = tags?.find((tag:Tag) => tag.Key === "sif:gitRevision")?.Value!;

			sifTenantTable.push([tenant, flags.environment, branch , gitTag, revision]);
		}

		this.log(table(sifTenantTable));

		return sifTenantList;
	}
}
