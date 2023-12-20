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
import { getAnswers, saveAnswers } from "../../utils/answers";
import { DeploymentCommand } from "../../types/deploymentCommand";
import { switchToPlatformLocation } from "../../utils/shell";
import { getDeployedStackByName } from "../../utils/github";
import { generateEnvironmentDeploymentFlags } from "../../utils/help";
import { Command } from "@oclif/core/lib/command";

const { SILENT_COMMAND_EXECUTION: isSilentStr } = process.env;
const isSilent = (isSilentStr) ? isSilentStr === "true" : true;

export class EnvironmentInstall extends DeploymentCommand<typeof EnvironmentInstall> {
	public static description = "Install SIF for the specified environment";
	public static examples = [
		"$ <%= config.bin %> <%= command.id %> -e stage",
		"$ <%= config.bin %> <%= command.id %> -e stage -h -c <PATH_TO_CONFIG_FILE>",
	];
	public static enableJsonFlag = true;

	public static flags = {
		...this.baseFlags,
		environment: Flags.string(
			{
				char: "e",
				required: true,
				description: "An environment represents an isolated deployment of tenantId(s)",
			}
		),
		headless: Flags.boolean(
			{
				char: "h",
				description: "Perform SIF environment upgrade in headless mode, if specified you also need to specify the configuration file",
				dependsOn: ["config"]
			}
		),
		config: Flags.string(
			{
				char: "c",
				description: "Path to configuration file used for environment upgrade",
			}
		)
	};

	protected override generateFlags(): Record<string, Command.Flag> {
		return generateEnvironmentDeploymentFlags();
	}

	public async runChild(): Promise<Record<string, unknown>> {
		const { flags } = await this.parse(EnvironmentInstall);
		const folder = await switchToPlatformLocation();
		const answers = await getAnswers(folder, flags, global.platformPackage.retrieveDeploymentContextFromArgs(flags));
		await saveAnswers(flags.environment, answers, folder, undefined, flags?.role);

		try {
			await getDeployedStackByName("CDKToolkit", flags?.role);
		} catch (error) {
			if ((error as Error).message === "Stack with id CDKToolkit does not exist") {
				shelljs.exec(`npm run cdk -- bootstrap -c environment=${flags.environment} --require-approval never ${(flags?.role) ? "--r " + flags.role : ""}`, { silent: isSilent });
			}
		}

		shelljs.exec(`npm run cdk -- deploy -c environment=${flags.environment} --require-approval never ${(flags?.role) ? "--r " + flags.role : ""}`, { silent: isSilent });
		return answers;
	}
}
