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
import { listDeployedInstances } from "../../utils/github";
import { switchToPlatformLocation, switchToTenantLocation } from "../../utils/shell";
import { getSavedAnswers, saveAnswers } from "../../utils/answers";

export class EnvironmentDelete extends DeploymentCommand<typeof EnvironmentDelete> {
    public static description = "Delete SIF environment";
    public static examples = [
        "$ <%= config.bin %> <%= command.id %> -e stage",
        "$ <%= config.bin %> <%= command.id %> -e stage --force",
    ];
    public static enableJsonFlag = true;

    public static flags = {
        environment: Flags.string(
            {
                char: "e",
                required: true,
                description: "An environment represents an isolated deployment of tenantId(s)",
            }
        ),
        force: Flags.boolean(
            {
                char: "f",
                description: "If specified, will also delete all tenants on the environment",
            }
        )
    };

    public async runChild(): Promise<void> {
        const { flags } = await this.parse(EnvironmentDelete);
        const tenants = await listDeployedInstances(flags.environment, flags?.role);

        if (tenants.length > 0) {
            if (flags.force) {
                const tenantLocation = await switchToTenantLocation();

                for (const tenant of tenants) {
					const savedAnswers = await getSavedAnswers(flags.environment, undefined, tenant.name, flags?.role);
					await saveAnswers(flags.environment, (savedAnswers)? savedAnswers : {}, tenantLocation.toString(), tenant.name, flags?.role);
                    if (shelljs.exec(`npm run cdk -- destroy -c environment=${tenant.environment} -c tenantId=${tenant.name} --require-approval never --force --all ${(flags?.role)? "--r "+ flags.role : "" }`).code !== 0) {
                        this.error(`Could not delete tenant ${tenants}`);
                    }
                }
            } else {
                this.error(`Could not delete environment until you delete these tenants : [ ${tenants.map(o => o.name).join(",")} ]`);
            }
        }

        const platformLocation = await switchToPlatformLocation();
		const savedAnswers = await getSavedAnswers(flags.environment, undefined, undefined, flags?.role);
		await saveAnswers(flags.environment, (savedAnswers)? savedAnswers : {}, platformLocation.toString(), undefined, flags?.role);
        if (shelljs.exec(`npm run cdk -- destroy -c environment=${flags.environment} --force ${(flags?.role)? "--r "+ flags.role : "" }`).code !== 0) {
            this.error(`Could not delete environment ${flags.environment}`);
        }
    }
}
