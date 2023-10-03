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

import { Command, Flags } from "@oclif/core";
import { simpleGit } from "simple-git";
import * as fs from "fs";
import path from "path";
import config from "../../utils/config";

const { SIF_FOLDER_NAME: sifFolderName, SIF_REPOSITORY_URL: sifRepositoryUrl } = process.env;

export default class CoreClone extends Command {
	public static description = "Clone SIF into current folder";
	public static examples = [
		"<%= config.bin %> <%= command.id %> -r https://github.com/aws-solutions-library-samples/guidance-for-aws-sustainability-insights-framework",
		"<%= config.bin %> <%= command.id %>"];

	public static flags = {
		repositoryUrl: Flags.string({ char: "r", description: "Url of sif repository", required: false, aliases: ["repository-url"] })
	};

	public async run(): Promise<void> {
		const { flags } = await this.parse(CoreClone);
		const folderName = sifFolderName!;
		const folderPath = path.join(process.cwd(), folderName);
		config.set("sifCorePath", folderPath);

		const repository = flags.repositoryUrl ?? sifRepositoryUrl!;
		this.log(`Cloning 📦 ${repository} into 📁 ${folderPath}`);

		let sifCoreGit;
		if (!fs.existsSync(folderName)) {
			sifCoreGit = simpleGit().outputHandler((_command, stdout, stderr) => {
				stdout.pipe(process.stdout);
				stderr.pipe(process.stderr);
			});
			await sifCoreGit.clone(repository, folderName, {});
		} else {
			this.warn(`folder ${folderName} already exists`);
		}
	}
}
