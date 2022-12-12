<div align="center">
<h3 align="center">SFDX PLZ STATUS </h3>
<p align="center">
SFDX plugin to help you keep your sfdx project and org synchronized and easily tracked

</p>
<a href="https://github.com/wbalbal/DeploymentStatusHelper/issues/new?assignees=scolladon&labels=bug&template=issue.md">Report Bug</a> <br />
<a href="https://github.com/wbalbal/DeploymentStatusHelper/issues/new?assignees=scolladon&labels=enhancement&template=enhancement.md">Request Feature</a>
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

**Plz** Is an sfdx plugin that will help you sync your local sfdx project and remote metadata on your org. You just have to ask nicely.

Your local sfdx code or a git repository can diverge anytime from the org metadata. This plugin will help get the status of what is not **synchronised**  **\***. 

Plz plugin will show you the differences, if any are found, between local (force-app/main/default) and remote org metadata, then generate the packages required to deploy/retrieve the metadata required to have a matching local/org state. 🥳

***\*** The word **synchronised** will be used everywhere in the documentation and logs of the plugin.

**Synchronised** means the local metadata is the same as the remote org status.
**Synchronise** means either deploy or retrieve.*

![plz_status_principle](/img/PLZ_General_Process.png)

  

## Is PLZ for you?

If you are already reading this documentation then maybe yes, it's for you.
But most importantly, if you ever find yourself in any of the following situations, then yes, you will find this plugin most useful to you:

 - You have overwritten some other dev's code by running a deploy command, or they did it to your code
 - You, or you and your team found yourselves with a local project that diverted so much of the org metadata that you are almost all the time paranoid about overwriting other metadata
 
 ![unhappy_Team](/img/PLZ_Unhappy_Team.png)

In this scenario you can clearly see the frustration of the team. All it takes for you is to run this simple command:

```sh
sfdx plz:status -u DemoOrg -o
```
 ![happy_Team](/img/PLZ_Happy_Team.png)

 And there you have it. A happy collaborating team  🍻

**Be careful:**
🤓You will need to manually review the generated package xml file to make sure that it is exactly what you want to synchronize 🤓



## Getting Started


### Prerequisites

The plugin requires an sfdx project.

It requires the org to have the source tracking activated. Please refer to the official [documentation](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_setup_enable_source_tracking_sandboxes.htm) .

### Installation

Clone this repoistory and install manually the plugin. Run the following command to install it:

```sh
git clone https://github.com/wbalbal/DeploymentStatusHelper
```
```sh
cd DeploymentStatusHelper/SfPlugin
```
```sh
sfdx plugins:link
```


## How to use it?

## `sfdx plz:status -u <string> [-o <boolean>]  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

```

USAGE

$ sfdx plz:status [-f <string>] [-i] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]**


OPTIONS

-u, --username The org you want to run this command against

-o, --output Provide this flag in case you want to generate the package.xml and destructivePackage.xml

--loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL) [default: warn] logging level for this command invocation

```

## Execution


### Execute plz

From the project repo folder, run the following command:
```sh
sfdx plz:status -u DemoOrg -o
```

The `sfdx plz:status` command can produce up to 4 useful artifacts:


**1) A `package.xml` and a `destructiveChanges.xml` file, inside a `retrievePackage` folder.** This `package.xml` file contains just the added/changed metadata to retrieve from the target org and the `destructiveChanges.xml` container just the removed/renamed metadata to be deleted from local project also.


**2) A `package.xml` and a `destructiveChanges.xml` file, inside a `deployChanges` folder.** This `package.xml` file contains just the added/changed metadata locally to be deployed to your org and `destructiveChanges.xml` file contains just the removed/renamed metadata to delete from the target org.


## Contributing
Any contributions you make are **appreciated**.
