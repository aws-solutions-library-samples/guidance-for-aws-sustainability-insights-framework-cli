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

import { execAsync } from "../../utils/shell";
import { table } from "table";
import { RepositoryCommand } from "../../types/repositoryCommand";
import { getLocalRepositoryVersion } from "../../utils/github";

export class CoreVersion extends RepositoryCommand<typeof CoreVersion> {
	public static enableJsonFlag = true;
	public static description = "Print the release tag currently checked out. If there is no release tag, show the branch and commit id";
	public static examples = ["<%= config.bin %> <%= command.id %>"];

	public async runChild(): Promise<Record<string, string | undefined>> {
		try {
			const { tag, version } = await getLocalRepositoryVersion();
			const data = [["version", "tag"], [version, tag]];
			this.log(table(data));
			return { tag, version };
		} catch (Exception) {
			const branch = (await execAsync("git branch --show-current", { silent: true })).trim();
			const revision = (await execAsync("git rev-parse HEAD", { silent: true })).trim();
			const data = [
				["branch", "revision"],
				[branch, revision],
			];
			this.log(table(data));
			return { branch, revision };
		}
	}
}
