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
import { cd } from "shelljs";
import * as rushlib from "@microsoft/rush-lib";
import { execAsync } from "../../utils/shell";
import { DeploymentCommand } from "../../types/deploymentCommand";

export class InstanceStart extends DeploymentCommand<typeof InstanceStart> {
	public static description = "Run the selected SIF module locally";
	public static flags = {
		...this.baseFlags,
		environment: Flags.string(
			{
				char: "e",
				name: "environment",
				required: true,
				description: "SIF environment to use for starting the module",
			}
		),
		tenantId: Flags.string(
			{
				char: "t",
				name: "tenantId",
				required: true,
				description: "SIF tenantId to use for starting the module",
			}
		),
		module: Flags.string(
			{
				char: "m",
				name: "module",
				required: true,
				description: "SIF module to run",
			}
		),
	};

	public static examples = [
		"<%= config.bin %> <%= command.id %> -m pipelines",
	];

	public async runChild(): Promise<void> {
		const { flags } = await this.parse(InstanceStart);
		const rushConfiguration = rushlib.RushConfiguration.loadFromDefaultLocation({
			startingFolder: process.cwd()
		});

		const region = flags.region ?? process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION;

		if (!region) {
			throw new Error("No region specified in the environment variable AWS_REGION or AWS_DEFAULT_REGION or using the -r argument");
		}

			const moduleConfiguration = rushConfiguration.findProjectByShorthandName(`@sif/${flags.module.toLocaleLowerCase()}`);
			if (!moduleConfiguration) {
				throw new Error(`Module ${flags.module} does not exist`);
			}
			cd(moduleConfiguration?.projectFolder);
			await execAsync(`export ENVIRONMENT=${flags.environment}; export TENANT_ID=${flags.tenantId}; export AWS_REGION=${region} && npm run start`, { silent: false });

	}
}
