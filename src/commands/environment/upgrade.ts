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
import { getAnswers, getSavedAnswers, saveAnswers } from "../../utils/answers";
import { getDeployedEnvironment, getLocalRepositoryVersion } from "../../utils/github";
import { compareVersions } from "compare-versions";
import { DeploymentCommand } from "../../types/deploymentCommand";
import { switchToPlatformLocation } from "../../utils/shell";

export class EnvironmentUpgrade extends DeploymentCommand<typeof EnvironmentUpgrade> {
    public static description = "Perform upgrade of SIF environment version";
    public static examples = [
        "$ <%= config.bin %> <%= command.id %> -e stage",
        "$ <%= config.bin %> <%= command.id %> -e stage -h -c <PATH_TO_CONFIG_FILE>",
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
        upgradeTenants: Flags.string(
            {
                char: "u",
                description: "Upgrade all tenants to match the local version",
                aliases: ["upgrade-tenants"]
            }
        ),
        headless: Flags.boolean(
            {
                char: "h",
                description: "Perform SIF environment upgrade in headless mode, if specified you also need to specify the configuration file",
                dependsOn: ["config"]
            }
        ),
        config: Flags.string(
            {
                char: "c",
                description: "Path to configuration file used for environment upgrade",
            }
        )
    };



    public async runChild(): Promise<Record<string, any>> {
        const { flags } = await this.parse(EnvironmentUpgrade);

        const remoteVersion = (await getDeployedEnvironment(flags.environment, undefined, flags?.role)).version?.match(/\d+.\d+.\d+/)?.[0];
        const localVersion = (await getLocalRepositoryVersion()).version?.match(/\d+.\d+.\d+/)?.[0];

        if (!remoteVersion) {
            this.error("Deployed SIF environment does not have a version");
        }

        if (!localVersion) {
            this.error("Local clone of SIF does not have a version");
        }

        if (compareVersions(localVersion, remoteVersion) !== 1) {
            this.error(`Deploy version ${remoteVersion} cannot be upgraded to ${localVersion}`);
        }

        const folder = await switchToPlatformLocation();
        const savedAnswers = await getSavedAnswers(flags.environment, global.platformPackage.retrieveDeploymentContextFromArgs(flags), undefined, flags?.role );
        const answers = await getAnswers(folder, flags, savedAnswers);
        await saveAnswers(flags.environment, answers, folder, undefined, flags?.role);
        shelljs.exec(`npm run cdk -- deploy -c environment=${flags.environment} --require-approval never ${(flags?.role)? "--r "+ flags.role : "" }`);
        return answers;
    }
}
