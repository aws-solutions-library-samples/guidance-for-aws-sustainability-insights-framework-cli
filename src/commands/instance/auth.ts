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

export class InstanceAuth extends DeploymentCommand<typeof InstanceAuth> {
	public static description = "Walks the user through the authentication process to get a JWT token to be used for API calls.";
	public static flags = {
		environment: Flags.string(
			{
				char: "e",
				required: true,
				description: "The environment to authenticate against",
			}
		),
		tenantId: Flags.string(
			{
				char: "t",
				required: true,
				description: "The id of the tenant to authenticate against",
			}
		),
		username: Flags.string(
			{
				char: "u",
				required: true,
				description: "The username to generate the token for",
			}
		),
		password: Flags.string(
			{
				char: "p",
				required: true,
				description: "The password of the user",
			}
		),
		newPassword: Flags.string(
			{
				char: "n",
				required: false,
				description: "The new password to be set for the user",
			}
		),
	};

	public static examples = [
		"<%= config.bin %> <%= command.id %> -t demo -e prod -r us-west-2 -u username -p password",
		"<%= config.bin %> <%= command.id %> -t demo -e prod -r us-west-2 -u username -p password -n newPassword",
	];


	public async runChild(): Promise<Record<string, any>> {

		const currentDirectory = shelljs.pwd().stdout;

		const rushConfiguration = rushlib.RushConfiguration.loadFromDefaultLocation({
			startingFolder: currentDirectory
		});
		const moduleConfiguration = rushConfiguration.findProjectByShorthandName("@sif/integration-tests");
		if (!moduleConfiguration) {
			this.error("Module @sif/integration-tests does not exist");
		}
		const { flags } = await this.parse(InstanceAuth);


		shelljs.cd(moduleConfiguration.projectFolder);

		let command = `npm run generate:token -- ${flags.tenantId} ${flags.environment} ${flags.username} ${flags.password}`;
		if(flags.newPassword){
			command += ` ${flags.newPassword}`;
		}

		const token = await shelljs.exec(command);
		if( token.indexOf("UserNotFoundException") > -1 || token.indexOf("NotAuthorizedException") > -1 ){
			this.error("Incorrect username or password");
		} else{
			return token;
		}

	}
}
