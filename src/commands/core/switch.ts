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

import { Flags, Help } from "@oclif/core";
import { simpleGit } from "simple-git";
import { execAsync } from "../../utils/shell";
import { RepositoryCommand } from "../../types/repositoryCommand";
import { getTagByReleaseVersion } from "../../utils/github";
import { compareVersions } from "compare-versions";

export class CoreSwitch extends RepositoryCommand<typeof CoreSwitch> {
	public static description = "Switch the local SIF repository to the specified RELEASE, BRANCH or COMMIT ID";
	public static flags = {
		release: Flags.string(
			{
				char: "r",
				name: "release",
				required: false,
				description: "SIF release version",
				exclusive: ["branch", "commit"]
			}
		),
		branch: Flags.string(
			{
				name: "branch",
				char: "b",
				required: false,
				description: "SIF repository branch",
				exclusive: ["release", "commit"]
			}
		),
		commitId: Flags.string(
			{
				name: "commitId",
				char: "c",
				required: false,
				aliases: ["commit-id"],
				description: "SIF revision commit hash",
				exclusive: ["release", "branch"]
			}
		),
	};

	public static examples = [
		"<%= config.bin %> <%= command.id %> -b main",
		"<%= config.bin %> <%= command.id %> -c ead2b1d",
		"<%= config.bin %> <%= command.id %> -r v1.7.1",
		"<%= config.bin %> <%= command.id %> -r LATEST",
	];

	public async runChild(): Promise<void> {
		const { flags } = await this.parse(CoreSwitch);
		if (!flags.release && !flags.branch && !flags.commitId) {
			this.warn("Should specify one of branch, commit or release");
			const help = new Help(this.config);
			await help.showHelp(["core", "switch"]);
		} else {
			let branchOrRevision;
			if (flags?.release === "LATEST") {
				const currentRepository = simpleGit(".");
				const tags = await currentRepository.tags();
				branchOrRevision = tags.latest;
			} else {

				if (flags.release) {
					if (compareVersions(flags.release, "v1.9.0") !== 1) {
						this.error("SIF CLI does not support versions prior to v1.9.0");
					}
					branchOrRevision = await getTagByReleaseVersion(flags.release);
				} else {
					branchOrRevision = flags.release ?? flags.commitId ?? flags.branch;
				}
			}
			await execAsync(`git checkout ${branchOrRevision}`, { silent: false });
		}
	}
}
