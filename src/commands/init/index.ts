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
import { NodePackage } from "../../packages/node.package";
import { NpmPackage } from "../../packages/npm.package";
import { AwsCliPackage } from "../../packages/awscli.package";
import { Listr } from "listr2";
import path from "path";
import config from "../../utils/config";


export default class Init extends Command {
	public static description = "Install SIF dependencies";
	public static examples = [
		"$ sif init",
	];

	public static flags = {
		projectPath: Flags.string({ char: "p", description: "path of the sif core project to be used when you are not directly cloning", required: false, aliases: ["projectPath"] })
	};

	public async run(): Promise<void> {
		const { flags } = await this.parse(Init);
		if (flags?.projectPath) {
			const folderPath = path.join(flags.projectPath);
			config.set("sifCorePath", folderPath);
		}



		const tasks = new Listr([
			...new AwsCliPackage(this).getTasks(),
			...new NodePackage(this).getTasks(),
			...new NpmPackage(this).getTasks()]);
		await tasks.run();
	}
}
