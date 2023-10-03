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

import { Flags } from "@oclif/core";
import shelljs from "shelljs";
import { getAnswers, getSavedAnswers, saveAnswers } from "../../utils/answers";
import { getDeployedEnvironment, getLocalRepositoryVersion } from "../../utils/github";
import { DeploymentCommand } from "../../types/deploymentCommand";
import { switchToPlatformLocation } from "../../utils/shell";

export class EnvironmentConfigure extends DeploymentCommand<typeof EnvironmentConfigure> {
	public static description = "Modify SIF configuration for the specified environment";
	public static examples = [
		"$ <%= config.bin %> <%= command.id %> -e stage",
		"$ <%= config.bin %> <%= command.id %> -e stage -h -c <PATH_TO_CONFIG_FILE>",
	];
	public static enableJsonFlag = true;

	public static flags = {
		environment: Flags.string(
			{
				char: "e",
				required: true,
				description: "An environment represents an isolated deployment of tenantId(s)",
			}
		),
		config: Flags.string(
			{
				char: "c",
				description: "Path to configuration file used for deployment",
			}
		),
		headless: Flags.boolean(
			{
				char: "h",
				description: "If provided, you also need to specify the path configuration file using -c",
				dependsOn: ["config"]
			}
		)
	};

	public static strict = true;


	public async runChild(): Promise<Record<string, any>> {
		const { flags } = await this.parse(EnvironmentConfigure);

		const { tag: remoteTag } = await getDeployedEnvironment(flags.environment, undefined ,flags?.role);
		const { tag: localTag } = await getLocalRepositoryVersion();
		if (remoteTag !== localTag) {
			this.error(`local repository tag ${localTag} does not match deployed tag ${remoteTag}`);
		}

		const folder = await switchToPlatformLocation();
		const savedAnswers = await getSavedAnswers(flags.environment, global.platformPackage.retrieveDeploymentContextFromArgs(flags), undefined, flags?.role );
		const answers = await getAnswers(folder, flags, savedAnswers);
		await saveAnswers(flags.environment, answers, folder, undefined, flags?.role);

		shelljs.exec(`npm run cdk -- deploy -c environment=${flags.environment} --require-approval never ${(flags?.role)? "--r "+ flags.role : "" }`);
		return answers;
	}
}
