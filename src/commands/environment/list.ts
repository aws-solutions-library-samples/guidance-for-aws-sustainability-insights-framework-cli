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

import { table } from "table";
import { listDeployedEnvironments } from "../../utils/github";
import { DeploymentCommand } from "../../types/deploymentCommand";

export default class EnvironmentList extends DeploymentCommand<typeof EnvironmentList> {
	public static description = "List SIF installed environments";
	public static examples = [
		"$ <%= config.bin %> <%= command.id %>",
	];
	public static enableJsonFlag = true;

	public async runChild(): Promise<any[]> {
		const { flags } = await this.parse(EnvironmentList);
		const deployedEnvironmentList = await listDeployedEnvironments(flags?.role);

		const data = [
			["name", "tag", "version"],
			...deployedEnvironmentList.map(o => [o.name, o.tag, o.version])
		];
		this.log(table(data));
		return deployedEnvironmentList;
	}
}
