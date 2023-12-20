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

import {  Flags } from "@oclif/core";
import { table } from "table";
import { getDeployedEnvironment } from "../../utils/github";
import { DeploymentCommand } from "../../types/deploymentCommand";

export default class EnvironmentVersion extends DeploymentCommand<typeof EnvironmentVersion> {
	public static description = "Return the version of deployed environment";
	public static examples = [
		"<%= config.bin %> <%= command.id %> -e stage",
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
		)
	};

	public async runChild(): Promise<Record<string, any>> {
		const { flags } = await this.parse(EnvironmentVersion);
		const { tag, version } = await getDeployedEnvironment(flags.environment, undefined, flags?.role);
		const data = [
			["version", "tag"],
			[version, tag]
		];
		this.log(table(data));
		return { version, tag };
	}
}
