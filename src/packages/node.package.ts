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

import { BasePackage } from "./base.package";
import { execAsync } from "../utils/shell";
import { ListrTask } from "listr2";

const { SILENT_COMMAND_EXECUTION:isSilentStr } = process.env;
const isSilent = (isSilentStr) ? isSilentStr === "true": true ;
export class NodePackage extends BasePackage {
	private nonWindowsTask = [
		{
			title: "Installing nvm",
			task: async () => {
				await execAsync("curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash", { silent: isSilent });
			},
		},
		{
			title: "Installing node v18.17.1",
			task: async () => {
				await execAsync(". ~/.nvm/nvm.sh && nvm install 18.17.1", { silent: isSilent });
			},
		},
	];

	private windowsTask = [
		{
			title: "Installing nvm for Windows",
			task: async () => {
				await execAsync("winget install -e --id CoreyButler.NVMforWindows", { silent: isSilent });
			},
		},
		{
			title: "Installing node v18.17.1",
			task: async () => {
				await execAsync("nvm install 18.17.1", { silent: isSilent });
			},
		},
	];

	getLinuxTasks(): ListrTask[] {
		return this.nonWindowsTask;
	}

	getMacTasks(): ListrTask[] {
		return this.nonWindowsTask;
	}

	getWindowsTasks(): ListrTask[] {
		return this.windowsTask;
	}
}
