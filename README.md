<img src="https://raw.githubusercontent.com/sorenkrabbe/Chrome-Salesforce-inspector/master/addon/icon128.png" align="right">

Salesforce Deployment Status Helper
===========================


# Salesforce DX Project: Next Steps 


Now that you’ve created a Salesforce DX project, what’s next? Here are some documentation resources to get you started.

## How Do You Plan to Deploy Your Changes?

Do you want to deploy a set of changes, or create a self-contained application? Choose a [development model](https://developer.salesforce.com/tools/vscode/en/user-guide/development-models).

## Configure Your Salesforce DX Project

The `sfdx-project.json` file contains useful configuration information for your project. See [Salesforce DX Project Configuration](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_ws_config.htm) in the _Salesforce DX Developer Guide_ for details about this file.

## Read All About It

- [Salesforce Extensions Documentation](https://developer.salesforce.com/tools/vscode/)
- [Salesforce CLI Setup Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm)
- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
- [Salesforce CLI Command Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference.htm)

Installation
------------

| [:sunny: Add to Chrome](https://chrome.google.com/webstore/detail/salesforce-inspector/aodjmnfhjibkcdimpodiifdjnnncaafh) | [:sunny: Add to Firefox](https://addons.mozilla.org/firefox/addon/salesforce-inspector/) |
| --- | --- |

1. Open `chrome://extensions/`.
2. Enable `Developer mode`.
3. Click `Load unpacked extension...`.
4. Select the `SfExtension` subdirectory of this repository.

## Cli Plugin

### USAGE
  **$ sfdx plz:sync [-f <string>] [-i] [-s] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]**

### OPTIONS
  <pre>
  -f, --filter=filter                         Metadata path you want ot include only  
  -i, --interactive                           Pass this flag if you want to run the interactive option for syncing components  
  -s, --save                                  Pass this flag if you want to save the status to you connected org  
  -u, --targetusername=targetusername         Username or alias for the target org; overrides default target org  
  --apiversion=apiversion                     Override the api version used for api requests made by this command  
  --loglevel=(trace|debug|info|warn|error     [default: warn]** logging level for this command invocation  
  |fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  
  </pre>
