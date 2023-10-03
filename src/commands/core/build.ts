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

import { RepositoryCommand } from "../../types/repositoryCommand";
import { exec } from "shelljs";

export default class CoreBuild extends RepositoryCommand<typeof CoreBuild> {
	public static description = "Performs incremental build of all SIF modules";
	public static examples = [
		"<%= config.bin %> <%= command.id %>",
	];

	public async runChild(): Promise<void> {
		const commands = [". ~/.nvm/nvm.sh", "nvm use 18.17.1", "rush update --bypass-policy", "rush build"];
		exec(commands.join(this.bashAndOperator), { silent: false });
	}
}
