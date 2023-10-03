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

export {};

export type ContextAnswer = Record<string, string | number | boolean>;

export interface SifUtility {
    retrieveDeploymentContext: (existing?: ContextAnswer) => Promise<ContextAnswer>;
    validateDeploymentContext: (existing: ContextAnswer) => Promise<void>;
    deploymentContextArgs: Record<string, any>;
    retrieveDeploymentContextFromArgs: (flags: Record<string, any>) => ContextAnswer;
    retrieveVersionCompatibilityMatrix: () => Record<string, Record<string, boolean>>;
    isPlatformCompatibleWithTenant: (platformVersion: string, tenantVersion: string) => boolean;
}


declare global {

    var platformPackage: SifUtility;

    var tenantPackage: SifUtility;

}




