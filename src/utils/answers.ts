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

import fs from "fs";
import { getDeployedEnvironment, getLocalRepositoryVersion } from "./github";
import { GetParameterCommand, PutParameterCommand } from "@aws-sdk/client-ssm";
import { getSSMClient } from "./awsClient";
import { ContextAnswer } from "../types/global";

const getAnswers = async (projectFolder: string, flags: Record<string, any>, existing?: ContextAnswer): Promise<Record<string, never>> => {
    const validatorLocation = `${projectFolder}/dist/cjs/${process.env.VALIDATOR_MODULE_FILENAME}`;
    if (!fs.existsSync(validatorLocation)) {
        throw new Error("Could not find validator location on checked out SIF repository");
    }
    // import the validator function
    const validator = require(validatorLocation);
    let answers;
    if (flags.headless && !fs.existsSync(flags.config!)) {
        throw new Error("Configuration file does not exists");
    } else if (flags.headless) {
        answers = JSON.parse(fs.readFileSync(flags.config!, { encoding: "utf8" }));
        await validator.validateDeploymentContext(answers);
    } else {
        // execute the validator function from sif-core
        answers = await validator.retrieveDeploymentContext(existing);
    }
    return answers;
};

const saveAnswers = async (environment: string, answers: ContextAnswer, moduleFolder: string, tenantId?: string, roleArn?: string): Promise<void> => {
    const { version, tag } = await getLocalRepositoryVersion();
    const prefix = tenantId ? `/sif/cli/shared/${tenantId}/${environment}` : `/sif/cli/shared/${environment}`;
	const ssmClient = await getSSMClient(roleArn);

    if (!fs.existsSync(moduleFolder)) {
        throw new Error(`Module folder ${moduleFolder} does not exists`);
    }

    // save answers to local cdk folder, this will be used on deployment
    fs.writeFileSync(`${moduleFolder}/cdk.context.json`, JSON.stringify(answers));

    // save answers remotely on ssm
    if (version) {
        await ssmClient.send(new PutParameterCommand({ Name: `${prefix}/version/${version}/config`, Value: JSON.stringify(answers), Type: "String", Overwrite: true }));
    } else {
        if (tag) {
            await ssmClient.send(new PutParameterCommand({ Name: `${prefix}/tag/${tag}/config`, Value: JSON.stringify(answers), Type: "String", Overwrite: true }));
        } else {
			await ssmClient.send(new PutParameterCommand({ Name: `${prefix}/config`, Value: JSON.stringify(answers), Type: "String", Overwrite: true }));
		}
    }
};

const getSavedAnswers = async (environment: string, overwriteAnswers?: ContextAnswer, tenantId?: string, roleArn?: string): Promise<ContextAnswer | undefined> => {
    const { version, tag } = await getDeployedEnvironment(environment, tenantId, roleArn);
    const prefix = tenantId ? `/sif/cli/shared/${tenantId}/${environment}` : `/sif/cli/shared/${environment}`;
	const ssmClient = await getSSMClient(roleArn);

    let response;
    try {
        if (version) {
            const answers = await ssmClient.send(new GetParameterCommand({ Name: `${prefix}/version/${version}/config` }));
            response = JSON.parse(answers.Parameter?.Value!);
        } else if (tag) {
            const answers = await ssmClient.send(new GetParameterCommand({ Name: `${prefix}/tag/${tag}/config` }));
            response = JSON.parse(answers.Parameter?.Value!);
        } else {
			const answers = await ssmClient.send(new GetParameterCommand({ Name: `${prefix}/config` }));
            response = JSON.parse(answers.Parameter?.Value!);
		}
        // overwrite saved answers
        if (overwriteAnswers) {
            Object.entries(overwriteAnswers).forEach(([key, value]) => {
                    response[key] = value;
                }
            );
        }

    } catch (Exception) {
    }
    return response;
};

const getRestrictedAnswers = async (projectFolder: string): Promise<string[]> => {
    const validatorLocation = `${projectFolder}/dist/cjs/${process.env.VALIDATOR_MODULE_FILENAME}`;
    if (!fs.existsSync(validatorLocation)) {
        throw new Error("Could not find validator location on checked out SIF repository");
    }
    // import the validator function
    const validator = require(validatorLocation);
    const answers = await validator.restrictedAnswers;
    return answers;
};


export {
    getAnswers,
    saveAnswers,
    getSavedAnswers,
    getRestrictedAnswers
};
