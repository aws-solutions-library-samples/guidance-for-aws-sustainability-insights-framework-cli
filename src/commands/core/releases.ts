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
import { execAsync } from "../../utils/shell";
import { RepositoryCommand } from "../../types/repositoryCommand";
import { listReleases } from "../../utils/github";

export default class CoreReleases extends RepositoryCommand<typeof CoreReleases> {
	public static enableJsonFlag = true;
	public static description = "Listing the existing tags in the SIF repository";
	public static examples = [
		"<%= config.bin %> <%= command.id %>",
	];

	public async runChild(): Promise<Record<string, unknown>> {
		const results = await listReleases();
		let currentTag: string;
		try {
			currentTag = (await execAsync("git describe --tags", { silent: true })).trim();
		} catch (Exception) {
			this.log("The repository does not contain any tag");
		}

		const data = [
			["version", "created at"],
			...results.reverse().map(r => [r.tag_name === currentTag ? `** ${r.name} **` : r.name, r.created_at])
		];
		this.log(table(data));
		return {
			current: results.find(o => o.tag_name === currentTag)?.tag_name,
			releases: results
		};
	}
}
