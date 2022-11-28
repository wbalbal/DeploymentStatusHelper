 **USAGE:**
 




<br />
<div align="center">

  <h3 align="center">SFDX PLZ STATUS </h3>

  <p align="center">
    SFDX plugin to help you keep your sfdx project and org synchronized and easily tracked
    <br />
    <a href="https://github.com/wbalbal/DeploymentStatusHelper/issues/new?assignees=scolladon&labels=bug&template=issue.md">Report Bug</a>
    ·
    <a href="https://github.com/wbalbal/DeploymentStatusHelper/issues/new?assignees=scolladon&labels=enhancement&template=enhancement.md">Request Feature</a>
  </p>
</div>



## TL;DR

```sh
git clone https://github.com/wbalbal/DeploymentStatusHelper
```

```sh
cd DeploymentStatusHelper/SfPlugin
```

```sh
sfdx plugins:link
```

```sh
sfdx plz:status -u DemoOrg -o
```

## What is plz plugin?

**Plz** Is an sfdx plugin that will help you sync your local sfdx project and remote metadata at your org. You just have to ask nicely.

Your local sfdx code or even in a git repository can diverge anytime from the org metadata status. So this plugin will help get the status of what is not **synchronised** **\*** . It will help you generate the package xml files for retreival and deployment that you need to do in order to do to have the same status of org and local metadata.

***\*** The word **synchronised** we be used everywhere in the documentation and logs of the plugin. 
**Synchronised** means a components or project have the same metadata as the remote org. 
**Synchronise** means either deploy or retrieve.*

![plz_status_principle](/img/PLZ_status_general_process.png)

## Is PLZ for you?

If you are already reading this documentation then yes it's for you.

**DISCLAIMER:**

**⚠️ sfdx plz plugin is NOT an officially supported tool ⚠️**

🤓You will need to manually review the generated package xml file to make sure that it is aligning with what you want to sychnronize 🤓

## Getting Started

### Prerequisites

The plugin requires an sfdx project.

It requires the org to have the source tracking activated. Please refer to the official [documentation](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_setup_enable_source_tracking_sandboxes.htm) .

### Installation

Clone this repoistory and install manually the plugin. Run the following command to install it:

```sh
git clone https://github.com/wbalbal/DeploymentStatusHelper
cd DeploymentStatusHelper/SfPlugin
sfdx plugins:link
```

Because this plugin is not signed, you can get a warning saying that "This plugin is not digitally signed and its authenticity cannot be verified". This is expected, and you will have to answer `y` (yes) to proceed with the installation.

## How to use it?



## `sfdx plz:status -u <string> [-o <boolean>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`
```
USAGE
  $ sfdx plz:status [-f <string>] [-i]  [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]**

OPTIONS
  -u, --username                                                                    The org you want to run this command against
  -o, --output                                                                      Provide this flag in case you want to generate the package.xml and destructivePackage.xml
  --json                                                                            Format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

## Walkthrough



### Execute plz

From the project repo folder, the CI pipeline will run the following command:

```sh
sfdx plz:status -u DemoOrg -o
```

which means:


The `sfdx plz:status` command can produces up to 4 usefull artifacts:

**1) A `package.xml` and a  `destructiveChanges.xml` files, inside a `retrievePackage` folder.** This `package.xml` file contains just the added/changed metadata to retrieve from the target org and the  `destructiveChanges.xml` container just the removed/renamed metadata to be deleted from local project also.

**2) A `package.xml` and a  `destructiveChanges.xml` files, inside a `deployChanges` folder.** This `package.xml` file contains just the added/changed metadata locally to be deployed to your org and `destructiveChanges.xml` file contains just the removed/renamed metadata to delete from the target org. 

**Note**: the `destructiveChanges` folder also contains a minimal package.xml file, because deploying destructive changes requires a package.xml (even an empty one).


### Deploy/Retrieve the unsynchronized metadata

The simplest option to deploy the changes is to use `force:source:deploy` command with `-x` parameter:

```sh
sfdx force:source:deploy -x package/package.xml --postdestructivechanges destructiveChanges/destructiveChanges.xml
```

However, keep in mind thate the above command will fail if the destructive change was supposed to be executed before the deployment (i.e. as `--predestructivechanges`), or if a warning occurs during deployment. Make sure to protect your CI/CD pipeline from those scenarios, so that it don't get stuck by a failed destructive change.

If needed, you can also split the added/modified metadata deployment from the deleted/renamed metadata deployment, as in the below examples:

Use the `package/package.xml` file to deploy only the added/modified metadata:

```sh
echo "--- package.xml generated with added and modified metadata ---"
cat package/package.xml
echo
echo "---- Deploying added and modified metadata ----"
sfdx force:source:deploy -x package/package.xml
```

Use the `destructiveChanges` folder to deploy only the destructive changes:

```sh
echo "--- destructiveChanges.xml generated with deleted metadata ---"
cat destructiveChanges/destructiveChanges.xml
echo
echo "--- Deleting removed metadata ---"
sfdx force:mdapi:deploy -d destructiveChanges --ignorewarnings
```


## Contributing

Any contributions you make are **appreciated**.