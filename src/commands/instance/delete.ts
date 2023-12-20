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

import { Flags } from "@oclif/core";
import shelljs from "shelljs";
import { DeploymentCommand } from "../../types/deploymentCommand";
import { getSavedAnswers, saveAnswers } from "../../utils/answers";
import { switchToTenantLocation } from "../../utils/shell";


export class InstanceDelete extends DeploymentCommand<typeof InstanceDelete> {
	public static description = "Delete the sif tenant.";
	public static flags = {
		...this.baseFlags,
		environment: Flags.string(
			{
				char: "e",
				required: true,
				description: "The environment to delete the tenant from",
			}
		),
		tenantId: Flags.string(
			{
				char: "t",
				required: true,
				description: "The id of the tenant to delete",
			}
		),

	};


	public async runChild(): Promise<void> {

	const { flags } = await this.parse(InstanceDelete);

	const params = `-c environment=${flags.environment} -c tenantId=${flags.tenantId}`;
	const tenantLocation = await switchToTenantLocation();
	const savedAnswers = await getSavedAnswers(flags.environment, undefined, flags.tenantId, flags?.role);
	await saveAnswers(flags.environment, (savedAnswers) ? savedAnswers : {}, tenantLocation.toString(), flags.tenantId, flags?.role);

	shelljs.exec(`npm run cdk -- destroy --all --require-approval never --force ${(flags?.role) ? "--r " + flags.role : ""} ${params}`);
	}
}
