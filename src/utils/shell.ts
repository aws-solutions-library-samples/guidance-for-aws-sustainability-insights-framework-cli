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

import shell from "shelljs";
import { promisify } from "util";
import shelljs from "shelljs";
import * as rushlib from "@microsoft/rush-lib";
import config from "./config";

const execAsync = promisify<string, { silent: boolean }, string>(shell.exec);

export type Folder = string;

const switchToTenantLocation = async (): Promise<Folder> => {
    const sifCoreLocation = config.get("sifCorePath") as string;
    const rushConfiguration = rushlib.RushConfiguration.loadFromDefaultLocation({
        startingFolder: sifCoreLocation
    });
    const moduleConfiguration = rushConfiguration.findProjectByShorthandName("@sif/infrastructure-tenant");
    if (!moduleConfiguration) {
        throw new Error("Module @sif/infrastructure-tenant does not exist");
    }
    shelljs.cd(moduleConfiguration.projectFolder);
    return moduleConfiguration.projectFolder;
};

const switchToPlatformLocation = async (): Promise<Folder> => {
    const sifCoreLocation = config.get("sifCorePath") as string;
    const rushConfiguration = rushlib.RushConfiguration.loadFromDefaultLocation({
        startingFolder: sifCoreLocation
    });
    const moduleConfiguration = rushConfiguration.findProjectByShorthandName("@sif/infrastructure-platform");
    if (!moduleConfiguration) {
        throw new Error("Module @sif/infrastructure-platform does not exist");
    }
    shelljs.cd(moduleConfiguration.projectFolder);
    return moduleConfiguration.projectFolder;
};

const switchToSifCore = async (): Promise<Folder> => {
    const sifCoreLocation = config.get("sifCorePath") as string;
    if (!sifCoreLocation) {
        throw new Error("You haven't cloned sif into your local environment");
    }
    shelljs.cd(sifCoreLocation);
    return sifCoreLocation;
};

export {
    execAsync,
    switchToSifCore,
    switchToPlatformLocation,
    switchToTenantLocation
};


