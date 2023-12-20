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
import { DeploymentCommand } from "../../types/deploymentCommand";

export class InstanceInsomnia extends DeploymentCommand<typeof InstanceInsomnia> {
	public static description = "Walks the user through the process to generate the insomnia environment file.";
	public static flags = {
		...this.baseFlags,
		environment: Flags.string(
			{
				char: "e",
				required: true,
				description: "The environment used to generate the insomnia environment file",
			}
		),
		tenantId: Flags.string(
			{
				char: "t",
				required: true,
				description: "The id of the tenant used to generate the insomnia environment file",
			}
		)
	};



	public async runChild(): Promise<void> {
		const currentDirectory = shelljs.pwd().stdout;
		const rushConfiguration = rushlib.RushConfiguration.loadFromDefaultLocation({
			startingFolder: currentDirectory
		});
		const moduleConfiguration = rushConfiguration.findProjectByShorthandName("@sif/integration-tests");
		if (!moduleConfiguration) {
			this.error("Module @sif/integration-tests does not exist");
		}
		const { flags } = await this.parse(InstanceInsomnia);


		shelljs.cd(moduleConfiguration.projectFolder);
		this.log(`npm run generate:insomnia:environment -- ${flags.tenantId} ${flags.environment}`);
		await shelljs.exec(`npm run generate:insomnia:environment -- ${flags.tenantId} ${flags.environment}`);
		this.log(`Insomnia environment file can be found in ${moduleConfiguration.projectFolder}/sif_core.${flags.tenantId}.${flags.environment}.insomnia_environment.json`);
	}
}
