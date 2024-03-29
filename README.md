sif-cli
=================
**The SIF Command Line Interface (sif-cli)** is an open-source tool that empowers you to interact with SIF components through commands in your command-line shell. With minimal configuration, `sif-cli` simplifies many of the complexities associated with managing SIF. Additionally, it incorporates various functionalities to ensure compatibility between your deployed version and the latest release of SIF.

Refer to the [SIF Repository](https://github.com/aws-solutions-library-samples/guidance-for-aws-sustainability-insights-framework/tree/main/docs/deployment/cli_walkthrough.md) for a detailed walkthrough.

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @sif/cli
$ sif COMMAND
running command...
$ sif (--version)
@sif/cli/1.0.0 darwin-x64 node-v18.18.2
$ sif --help [COMMAND]
USAGE
  $ sif COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`sif core build`](#sif-core-build)
* [`sif core clone`](#sif-core-clone)
* [`sif core releases`](#sif-core-releases)
* [`sif core switch`](#sif-core-switch)
* [`sif core version`](#sif-core-version)
* [`sif environment configure`](#sif-environment-configure)
* [`sif environment delete`](#sif-environment-delete)
* [`sif environment install`](#sif-environment-install)
* [`sif environment list`](#sif-environment-list)
* [`sif environment upgrade`](#sif-environment-upgrade)
* [`sif environment version`](#sif-environment-version)
* [`sif help [COMMANDS]`](#sif-help-commands)
* [`sif init`](#sif-init)
* [`sif instance auth`](#sif-instance-auth)
* [`sif instance configure`](#sif-instance-configure)
* [`sif instance delete`](#sif-instance-delete)
* [`sif instance insomnia`](#sif-instance-insomnia)
* [`sif instance install`](#sif-instance-install)
* [`sif instance list`](#sif-instance-list)
* [`sif instance postman`](#sif-instance-postman)
* [`sif instance start`](#sif-instance-start)
* [`sif instance upgrade`](#sif-instance-upgrade)
* [`sif plugins`](#sif-plugins)
* [`sif plugins:install PLUGIN...`](#sif-pluginsinstall-plugin)
* [`sif plugins:inspect PLUGIN...`](#sif-pluginsinspect-plugin)
* [`sif plugins:install PLUGIN...`](#sif-pluginsinstall-plugin-1)
* [`sif plugins:link PLUGIN`](#sif-pluginslink-plugin)
* [`sif plugins:uninstall PLUGIN...`](#sif-pluginsuninstall-plugin)
* [`sif plugins reset`](#sif-plugins-reset)
* [`sif plugins:uninstall PLUGIN...`](#sif-pluginsuninstall-plugin-1)
* [`sif plugins:uninstall PLUGIN...`](#sif-pluginsuninstall-plugin-2)
* [`sif plugins update`](#sif-plugins-update)

## `sif core build`

Performs incremental build of all SIF modules

```
USAGE
  $ sif core build

DESCRIPTION
  Performs incremental build of all SIF modules

EXAMPLES
  $ sif core build
```

_See code: [src/commands/core/build.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/core/build.ts)_

## `sif core clone`

Clone SIF into current folder

```
USAGE
  $ sif core clone [-r <value>]

FLAGS
  -r, --repositoryUrl=<value>  Url of sif repository

DESCRIPTION
  Clone SIF into current folder

EXAMPLES
  $ sif core clone -r https://github.com/aws-solutions-library-samples/guidance-for-aws-sustainability-insights-framework

  $ sif core clone
```

_See code: [src/commands/core/clone.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/core/clone.ts)_

## `sif core releases`

Listing the existing tags in the SIF repository

```
USAGE
  $ sif core releases

DESCRIPTION
  Listing the existing tags in the SIF repository

EXAMPLES
  $ sif core releases
```

_See code: [src/commands/core/releases.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/core/releases.ts)_

## `sif core switch`

Switch the local SIF repository to the specified RELEASE, BRANCH or COMMIT ID

```
USAGE
  $ sif core switch [-c <value> | [-r <value> | -b <value> | ] | ]

FLAGS
  -b, --branch=<value>    SIF repository branch
  -c, --commitId=<value>  SIF revision commit hash
  -r, --release=<value>   SIF release version

DESCRIPTION
  Switch the local SIF repository to the specified RELEASE, BRANCH or COMMIT ID

EXAMPLES
  $ sif core switch -b main

  $ sif core switch -c ead2b1d

  $ sif core switch -r v1.7.1

  $ sif core switch -r LATEST
```

_See code: [src/commands/core/switch.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/core/switch.ts)_

## `sif core version`

Print the release tag currently checked out. If there is no release tag, show the branch and commit id

```
USAGE
  $ sif core version

DESCRIPTION
  Print the release tag currently checked out. If there is no release tag, show the branch and commit id

EXAMPLES
  $ sif core version
```

_See code: [src/commands/core/version.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/core/version.ts)_

## `sif environment configure`

Modify SIF configuration for the specified environment

```
USAGE
  $ sif environment configure -e <value> [-r <value>] [-l <value>] [-h -c <value>]

FLAGS
  -c, --config=<value>       Path to configuration file used for deployment
  -e, --environment=<value>  (required) An environment represents an isolated deployment of tenantId(s)
  -h, --headless             If provided, you also need to specify the path configuration file using -c
  -l, --role=<value>         The RoleArn for the CLI to assume for deployment
  -r, --region=<value>       AWS region used when running the subcommands

DESCRIPTION
  Modify SIF configuration for the specified environment

EXAMPLES
  $ sif environment configure -e stage

  $ sif environment configure -e stage -h -c <PATH_TO_CONFIG_FILE>
```

_See code: [src/commands/environment/configure.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/environment/configure.ts)_

## `sif environment delete`

Delete SIF environment

```
USAGE
  $ sif environment delete -e <value> [-r <value>] [-l <value>] [-f]

FLAGS
  -e, --environment=<value>  (required) An environment represents an isolated deployment of tenantId(s)
  -f, --force                If specified, will also delete all tenants on the environment
  -l, --role=<value>         The RoleArn for the CLI to assume for deployment
  -r, --region=<value>       AWS region used when running the subcommands

DESCRIPTION
  Delete SIF environment

EXAMPLES
  $ sif environment delete -e stage

  $ sif environment delete -e stage --force
```

_See code: [src/commands/environment/delete.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/environment/delete.ts)_

## `sif environment install`

Install SIF for the specified environment

```
USAGE
  $ sif environment install -e <value> [-r <value>] [-l <value>] [-h -c <value>]

FLAGS
  -c, --config=<value>       Path to configuration file used for environment upgrade
  -e, --environment=<value>  (required) An environment represents an isolated deployment of tenantId(s)
  -h, --headless             Perform SIF environment upgrade in headless mode, if specified you also need to specify the
                             configuration file
  -l, --role=<value>         The RoleArn for the CLI to assume for deployment
  -r, --region=<value>       AWS region used when running the subcommands

DESCRIPTION
  Install SIF for the specified environment

EXAMPLES
  $ sif environment install -e stage

  $ sif environment install -e stage -h -c <PATH_TO_CONFIG_FILE>
```

_See code: [src/commands/environment/install.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/environment/install.ts)_

## `sif environment list`

List SIF installed environments

```
USAGE
  $ sif environment list

DESCRIPTION
  List SIF installed environments

EXAMPLES
  $ sif environment list
```

_See code: [src/commands/environment/list.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/environment/list.ts)_

## `sif environment upgrade`

Perform upgrade of SIF environment version

```
USAGE
  $ sif environment upgrade -e <value> [-r <value>] [-l <value>] [-u <value>] [-h -c <value>]

FLAGS
  -c, --config=<value>          Path to configuration file used for environment upgrade
  -e, --environment=<value>     (required) An environment represents an isolated deployment of tenantId(s)
  -h, --headless                Perform SIF environment upgrade in headless mode, if specified you also need to specify
                                the configuration file
  -l, --role=<value>            The RoleArn for the CLI to assume for deployment
  -r, --region=<value>          AWS region used when running the subcommands
  -u, --upgradeTenants=<value>  Upgrade all tenants to match the local version

DESCRIPTION
  Perform upgrade of SIF environment version

EXAMPLES
  $ sif environment upgrade -e stage

  $ sif environment upgrade -e stage -h -c <PATH_TO_CONFIG_FILE>
```

_See code: [src/commands/environment/upgrade.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/environment/upgrade.ts)_

## `sif environment version`

Return the version of deployed environment

```
USAGE
  $ sif environment version -e <value> [-r <value>] [-l <value>]

FLAGS
  -e, --environment=<value>  (required) An environment represents an isolated deployment of tenantId(s)
  -l, --role=<value>         The RoleArn for the CLI to assume for deployment
  -r, --region=<value>       AWS region used when running the subcommands

DESCRIPTION
  Return the version of deployed environment

EXAMPLES
  $ sif environment version -e stage
```

_See code: [src/commands/environment/version.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/environment/version.ts)_

## `sif help [COMMANDS]`

Display help for sif.

```
USAGE
  $ sif help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for sif.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.20/src/commands/help.ts)_

## `sif init`

Install SIF dependencies

```
USAGE
  $ sif init [-p <value>]

FLAGS
  -p, --projectPath=<value>  path of the sif core project to be used when you are not directly cloning

DESCRIPTION
  Install SIF dependencies

EXAMPLES
  $ sif init
```

_See code: [src/commands/init/index.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/init/index.ts)_

## `sif instance auth`

Walks the user through the authentication process to get a JWT token to be used for API calls.

```
USAGE
  $ sif instance auth -e <value> -t <value> -u <value> -p <value> [-r <value>] [-l <value>] [-n <value>]

FLAGS
  -e, --environment=<value>  (required) The environment to authenticate against
  -l, --role=<value>         The RoleArn for the CLI to assume for deployment
  -n, --newPassword=<value>  The new password to be set for the user
  -p, --password=<value>     (required) The password of the user
  -r, --region=<value>       AWS region used when running the subcommands
  -t, --tenantId=<value>     (required) The id of the tenant to authenticate against
  -u, --username=<value>     (required) The username to generate the token for

DESCRIPTION
  Walks the user through the authentication process to get a JWT token to be used for API calls.

EXAMPLES
  $ sif instance auth -t demo -e prod -r us-west-2 -u username -p password

  $ sif instance auth -t demo -e prod -r us-west-2 -u username -p password -n newPassword
```

_See code: [src/commands/instance/auth.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/instance/auth.ts)_

## `sif instance configure`

Redeploys the same instance version.

```
USAGE
  $ sif instance configure -e <value> -t <value> [-r <value>] [-l <value>] [-h -c <value>]

FLAGS
  -c, --config=<value>       Path to configuration file used for deployment
  -e, --environment=<value>  (required) The environment to redeploy the same instance version to
  -h, --headless             If provided, bypass the questions. You will also need to specify the path configuration
                             file using -c
  -l, --role=<value>         The RoleArn for the CLI to assume for deployment
  -r, --region=<value>       AWS region used when running the subcommands
  -t, --tenantId=<value>     (required) The id of the tenant to redeploy

DESCRIPTION
  Redeploys the same instance version.

EXAMPLES
  $ sif instance configure -t demo -e prod -r us-west-2
```

_See code: [src/commands/instance/configure.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/instance/configure.ts)_

## `sif instance delete`

Delete the sif tenant.

```
USAGE
  $ sif instance delete -e <value> -t <value> [-r <value>] [-l <value>]

FLAGS
  -e, --environment=<value>  (required) The environment to delete the tenant from
  -l, --role=<value>         The RoleArn for the CLI to assume for deployment
  -r, --region=<value>       AWS region used when running the subcommands
  -t, --tenantId=<value>     (required) The id of the tenant to delete

DESCRIPTION
  Delete the sif tenant.
```

_See code: [src/commands/instance/delete.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/instance/delete.ts)_

## `sif instance insomnia`

Walks the user through the process to generate the insomnia environment file.

```
USAGE
  $ sif instance insomnia -e <value> -t <value> [-r <value>] [-l <value>]

FLAGS
  -e, --environment=<value>  (required) The environment used to generate the insomnia environment file
  -l, --role=<value>         The RoleArn for the CLI to assume for deployment
  -r, --region=<value>       AWS region used when running the subcommands
  -t, --tenantId=<value>     (required) The id of the tenant used to generate the insomnia environment file

DESCRIPTION
  Walks the user through the process to generate the insomnia environment file.
```

_See code: [src/commands/instance/insomnia.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/instance/insomnia.ts)_

## `sif instance install`

Walks the user through an interactive list of questions needed to deploy sif core.

```
USAGE
  $ sif instance install -e <value> -t <value> [-r <value>] [-l <value>] [-h -c <value>]

FLAGS
  -c, --config=<value>       Path to configuration file used for deployment
  -e, --environment=<value>  (required) The environment to deploy the tenant to
  -h, --headless             If provided, bypass the questions. You will also need to specify the path configuration
                             file using -c
  -l, --role=<value>         The RoleArn for the CLI to assume for deployment
  -r, --region=<value>       AWS region used when running the subcommands
  -t, --tenantId=<value>     (required) The id of the tenant to deploy

DESCRIPTION
  Walks the user through an interactive list of questions needed to deploy sif core.

EXAMPLES
  $ sif instance install -t demo -e prod -r us-west-2
```

_See code: [src/commands/instance/install.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/instance/install.ts)_

## `sif instance list`

Lists all deployed tenants within a specific environment

```
USAGE
  $ sif instance list -e <value> [-r <value>]

FLAGS
  -e, --environment=<value>  (required) An environment represents an isolated deployment of tenantId(s)
  -r, --region=<value>       Region used for listing of sif tenants

DESCRIPTION
  Lists all deployed tenants within a specific environment

EXAMPLES
  $ sif instance list -t demo -e prod -r us-west-2 -a 1234567
```

_See code: [src/commands/instance/list.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/instance/list.ts)_

## `sif instance postman`

Walks the user through the process to generate the postman environment file.

```
USAGE
  $ sif instance postman -e <value> -t <value> [-r <value>] [-l <value>]

FLAGS
  -e, --environment=<value>  (required) The environment used to generate the postman environment file
  -l, --role=<value>         The RoleArn for the CLI to assume for deployment
  -r, --region=<value>       AWS region used when running the subcommands
  -t, --tenantId=<value>     (required) The tenantId used to generate the postman environment file

DESCRIPTION
  Walks the user through the process to generate the postman environment file.

EXAMPLES
  $ sif instance postman -t demo -e prod -r us-west-2 -a 1234567
```

_See code: [src/commands/instance/postman.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/instance/postman.ts)_

## `sif instance start`

Run the selected SIF module locally

```
USAGE
  $ sif instance start -e <value> -t <value> -m <value> [-r <value>] [-l <value>]

FLAGS
  -e, --environment=<value>  (required) SIF environment to use for starting the module
  -l, --role=<value>         The RoleArn for the CLI to assume for deployment
  -m, --module=<value>       (required) SIF module to run
  -r, --region=<value>       AWS region used when running the subcommands
  -t, --tenantId=<value>     (required) SIF tenantId to use for starting the module

DESCRIPTION
  Run the selected SIF module locally

EXAMPLES
  $ sif instance start -m pipelines
```

_See code: [src/commands/instance/start.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/instance/start.ts)_

## `sif instance upgrade`

Perform upgrade of SIF instance version

```
USAGE
  $ sif instance upgrade -e <value> -t <value> [-r <value>] [-l <value>] [-h -c <value>]

FLAGS
  -c, --config=<value>       Path to configuration file used for upgrade
  -e, --environment=<value>  (required) The environment to upgrade the tenant for
  -h, --headless             If provided, bypass the questions. You will also need to specify the path configuration
                             file using -c
  -l, --role=<value>         The RoleArn for the CLI to assume for deployment
  -r, --region=<value>       AWS region used when running the subcommands
  -t, --tenantId=<value>     (required) The id of the tenant to upgrade

DESCRIPTION
  Perform upgrade of SIF instance version

EXAMPLES
  $ sif instance upgrade -t demo -e prod -r us-west-2 -a 1234567
```

_See code: [src/commands/instance/upgrade.ts](https://github.com/aws-solutions-library-sample/sif-cli/blob/v1.0.0/src/commands/instance/upgrade.ts)_

## `sif plugins`

List installed plugins.

```
USAGE
  $ sif plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ sif plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/index.ts)_

## `sif plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ sif plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ sif plugins add

EXAMPLES
  $ sif plugins add myplugin 

  $ sif plugins add https://github.com/someuser/someplugin

  $ sif plugins add someuser/someplugin
```

## `sif plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ sif plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ sif plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/inspect.ts)_

## `sif plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ sif plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ sif plugins add

EXAMPLES
  $ sif plugins install myplugin 

  $ sif plugins install https://github.com/someuser/someplugin

  $ sif plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/install.ts)_

## `sif plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ sif plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help      Show CLI help.
  -v, --verbose
  --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ sif plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/link.ts)_

## `sif plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ sif plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ sif plugins unlink
  $ sif plugins remove

EXAMPLES
  $ sif plugins remove myplugin
```

## `sif plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ sif plugins reset
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/reset.ts)_

## `sif plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ sif plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ sif plugins unlink
  $ sif plugins remove

EXAMPLES
  $ sif plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/uninstall.ts)_

## `sif plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ sif plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ sif plugins unlink
  $ sif plugins remove

EXAMPLES
  $ sif plugins unlink myplugin
```

## `sif plugins update`

Update installed plugins.

```
USAGE
  $ sif plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/update.ts)_
<!-- commandsstop -->
