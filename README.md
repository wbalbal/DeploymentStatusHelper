Salesforce Deployment Status Helper
===========================


Installation
------------

| [:sunny: Add to Chrome](https://chrome.google.com/webstore/detail/salesforce-inspector/aodjmnfhjibkcdimpodiifdjnnncaafh) | [:sunny: Add to Firefox](https://addons.mozilla.org/firefox/addon/salesforce-inspector/) |
| --- | --- |

1. Open `chrome://extensions/`.
2. Enable `Developer mode`.
3. Click `Load unpacked extension...`.
4. Select the `SfExtension` subdirectory of this repository.

## Cli Plugin

1. Go to the folder `SfPlugin`.
2. Execute `sfdx plugins:link`

Now you have the plugin installed

### USAGE
  **$ sfdx plz:sync [-f <string>] [-i] [-s] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]**
 
 **eg: sfdx plz:sync -u user@example.com** -> This will print the status and diff of the org/local
  **eg: sfdx plz:sync -u user@example.com-s ** -> This will print the status and diff of the org/local and save the result to the org

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
