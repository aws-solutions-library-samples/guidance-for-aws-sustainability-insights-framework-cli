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
import { getAnswers, saveAnswers } from "../../utils/answers";;
import { DeploymentCommand } from "../../types/deploymentCommand";

export class InstanceInstall extends DeploymentCommand<typeof InstanceInstall> {
	public static description = "Walks the user through an interactive list of questions needed to deploy sif core.";
	public static flags = {
		environment: Flags.string(
			{
				char: "e",
				required: true,
				description: "The environment to deploy the tenant to",
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
				description: "If provided, bypass the questions. You will also need to specify the path configuration file using -c",
				dependsOn: ["config"]
			}
		),
		tenantId: Flags.string(
			{
				char: "t",
				required: true,
				description: "The id of the tenant to deploy",
			}
		),

	};

	public static examples = [
		"<%= config.bin %> <%= command.id %> -t demo -e prod -r us-west-2",
	];


	public async runChild(): Promise<Record<string, any>> {

		const currentDirectory = shelljs.pwd().stdout;

		const rushConfiguration = rushlib.RushConfiguration.loadFromDefaultLocation({
			startingFolder: currentDirectory
		});
		const moduleConfiguration = rushConfiguration.findProjectByShorthandName("@sif/infrastructure-tenant");
		if (!moduleConfiguration) {
			this.error("Module @sif/infrastructure-tenant does not exist");
		}
		const { flags } = await this.parse(InstanceInstall);
		const answers = await getAnswers(moduleConfiguration.projectFolder, flags, global.tenantPackage.retrieveDeploymentContextFromArgs(flags));
		await saveAnswers(flags.environment, answers, moduleConfiguration.projectFolder, flags.tenantId, flags?.role);

		const params =  `-c environment=${flags.environment} -c tenantId=${flags.tenantId}`;
		shelljs.cd(moduleConfiguration.projectFolder);
		shelljs.exec(`npm run cdk -- deploy --all --concurrency=10  --require-approval never ${(flags?.role)? "--r "+ flags.role : "" } ${params}`);
		return answers;

	}
}
