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

import { Command, CommandHelp, Help, Flags } from "@oclif/core";
import Flag = Command.Flag;

const generateVersionSpecificFlags = (type: "platform" | "tenant"): Record<string, Flag> => {
    const convertToFlags = (prev, curr) => {
        const { type, ...rest } = curr[1];
        switch (type) {
            case "number":
            case "string":
                prev[curr[0]] = Flags.string(rest);
                break;
            case "boolean":
                prev[curr[0]] = Flags.boolean(rest);
                break;
        }
        return prev;
    };
    let extraFlags = {};

    if (type === "platform" && global.platformPackage?.deploymentContextArgs) {
        extraFlags = Object.entries(global.platformPackage.deploymentContextArgs).reduce(convertToFlags, {});
    }
    if (type === "tenant" && global.tenantPackage?.deploymentContextArgs) {
        extraFlags = Object.entries(global.tenantPackage.deploymentContextArgs).reduce(convertToFlags, {});
    }

    return extraFlags;
};

export default class SifHelp extends Help {
    public getCommandHelpClass(command: Command.Class | Command.Loadable | Command.Cached): CommandHelp {
        let extraFlags = {};
        switch (command.id) {
            case "environment configure":
            case "environment install":
            case "environment upgrade":
                extraFlags = generateVersionSpecificFlags("platform");
                break;
			case "instance configure":
			case "instance install":
			case "instance upgrade":
				extraFlags = generateVersionSpecificFlags("tenant");
			break;
        }

        command.flags = {
            ...command.flags,
            ...extraFlags
        };

        return new this.CommandHelpClass(command, this.config, this.opts);
    }
}

export {
    generateVersionSpecificFlags
};

