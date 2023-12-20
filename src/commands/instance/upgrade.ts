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
import * as rushlib from "@microsoft/rush-lib";
import { getAnswers, getSavedAnswers, saveAnswers } from "../../utils/answers";
import { getDeployedEnvironment, getLocalRepositoryVersion } from "../../utils/github";
import { compareVersions } from "compare-versions";
import { DeploymentCommand } from "../../types/deploymentCommand";
import { generateInstanceDeploymentFlags } from "../../utils/help";
import { Command } from "@oclif/core/lib/command";


export class InstanceUpgrade extends DeploymentCommand<typeof InstanceUpgrade> {
	public static description = "Perform upgrade of SIF instance version";
	public static flags = {
		...this.baseFlags,
		environment: Flags.string(
			{
				char: "e",
				required: true,
				description: "The environment to upgrade the tenant for",
			}
		),
		config: Flags.string(
			{
				char: "c",
				description: "Path to configuration file used for upgrade",
			}
		),
		headless: Flags.boolean(
			{
				char: "h",
				description: "If provided, bypass the questions. You will also need to specify the path configuration file using -c",
				dependsOn: ["config"]
			}
		),
		tenantId: Flags.string(
			{
				char: "t",
				required: true,
				description: "The id of the tenant to upgrade",
			}
		),

	};

	public static examples = [
		"<%= config.bin %> <%= command.id %> -t demo -e prod -r us-west-2 -a 1234567",
	];

	protected override generateFlags(): Record<string, Command.Flag> {
		return generateInstanceDeploymentFlags();
	}

	public async runChild(): Promise<Record<string, any>> {

		const currentDirectory = shelljs.pwd().stdout;

		const rushConfiguration = rushlib.RushConfiguration.loadFromDefaultLocation({
			startingFolder: currentDirectory
		});

		const moduleConfiguration = rushConfiguration.findProjectByShorthandName("@sif/infrastructure-tenant");
		if (!moduleConfiguration) {
			this.error("Module @sif/infrastructure-tenant does not exist");
		}
		const { flags } = await this.parse(InstanceUpgrade);

		const remoteVersion = (await getDeployedEnvironment(flags.environment, flags.tenantId, flags?.role)).version?.match(/\d+.\d+.\d+/)?.[0];
		const localVersion = (await getLocalRepositoryVersion()).version?.match(/\d+.\d+.\d+/)?.[0];
		this.log(`remoteVersion:${remoteVersion}, localVersion:${localVersion}`);
		if (!remoteVersion) {
			this.error("The deployed SIF instance is not compatible with the sif cli. Please upgrade your deployed version manually.");
		}

		if (!localVersion) {
			this.error("The local SIF repo is not compatible with the sif cli. Please update to a compatible version.");
		}

		if (compareVersions(localVersion, remoteVersion) !== 1) {
			this.error(`Deployed version ${remoteVersion} cannot be upgraded to ${localVersion}`);
		}


		const savedAnswers = await getSavedAnswers(flags.environment, global.tenantPackage.retrieveDeploymentContextFromArgs(flags), flags.tenantId, flags?.role);

		// overwrite saved answers with value from command line
		if (savedAnswers) {
			Object
				.entries(global.platformPackage.retrieveDeploymentContextFromArgs(flags) as Record<string, any>)
				.forEach(([key, value]) => {
						savedAnswers[key] = value;
					}
				);
		}

		const answers = await getAnswers(moduleConfiguration.projectFolder, flags, savedAnswers);
		await saveAnswers(flags.environment, answers, moduleConfiguration.projectFolder, flags.tenantId, flags?.role);

		const params = `-c environment=${flags.environment} -c tenantId=${flags.tenantId}`;
		shelljs.cd(moduleConfiguration.projectFolder);
		shelljs.exec(`npm run cdk -- synth --all --concurrency=10  --require-approval never ${(flags?.role) ? "--r " + flags.role : ""}  ${params}}`);
		return answers;

	}
}
