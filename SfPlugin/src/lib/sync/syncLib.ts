import { Org, SfProject } from "@salesforce/core";
import { AnyJson } from '@salesforce/ts-types';
import { SourceTracking } from '@salesforce/source-tracking';
import { ComponentSet, MetadataResolver } from '@salesforce/source-deploy-retrieve';
import { FlagsPayload, StatusOutputRow, StatusRowRequest } from "../types";
const fs = require("fs")
const path = require("path")

export default class SyncLib {
	private org: Org;
	private project: SfProject;
	private flagsPayload: FlagsPayload;
    private defaultRootMetadataPath: string = './force-app/main/default';

	constructor(org: Org, project: SfProject, flagsPayload: FlagsPayload) {
		this.org = org;
		this.project = project;
		this.flagsPayload = flagsPayload;
	}

    public async run(): Promise<AnyJson> {
        const tracking = await SourceTracking.create({
            org: this.org,
            project: this.project,
          });
        const statusList: StatusOutputRow[] = await tracking.getStatus({
            local: true,
            remote: true,
        });
        await this.saveSync(statusList, this.flagsPayload.saveRecords);
        if(this.flagsPayload.interactive){
            await this.syncMetadata(statusList);
        }
        return { success: true };
    }

    private async syncMetadata(statusRowList: StatusOutputRow[]): Promise<AnyJson> {
        for(const status of statusRowList){
            if(status.origin === "local" && (status.state === "add" || status.state === "modify")){
                const deployJob = await ComponentSet
                    .fromSource(status.filePath)
                    .deploy({ usernameOrConnection: this.org.getUsername() });

                const result = await deployJob.pollStatus();
                console.log(result.getFileResponses());
            }
            if(status.origin === "local" && status.state === "delete"){
                const retrieveJob = await ComponentSet
                    .fromSource(status.filePath)
                    .retrieve({
                        usernameOrConnection: this.org.getUsername(),
                        output: './force-app',
                        merge: true
                    });
                const result = await retrieveJob.pollStatus();
                console.log(result.getFileResponses());
            }
            if(status.origin === "remote" && (status.state === "add" || status.state === "modify")){
                const retrieveJob = await ComponentSet
                    .fromSource(status.filePath)
                    .retrieve({
                        usernameOrConnection: this.org.getUsername(),
                        output: './force-app',
                        merge: true
                    });
                const result = await retrieveJob.pollStatus();
                console.log(result.getFileResponses());
            }
        }
        return { success: true };
    }

    private async saveSync(statusRowList: StatusOutputRow[], saveRecords: boolean): Promise<AnyJson> {
        try {
            const statusRowRequestList = await this.processSyncStatus(statusRowList);
            //@todo make the records unique
            console.log(statusRowRequestList);
            if(saveRecords){
                const insertResult = await this.org.getConnection().insert( "Plz_Metadata_Status__c", statusRowRequestList);
                console.log(insertResult.map(r => r.errors));
            }
            return { success: true };
        } catch (error) {
            console.log(`Could not insert your SyncStatus list due to reason: ${error}`);
            return { success: false };
        }
    }

    private async processSyncStatus(statusList: StatusOutputRow[]): Promise<StatusRowRequest[]>{
        let updatedStatusList: StatusRowRequest[] = [];
        const metaDataFiles = await this.getAllMetadataFiles(this.defaultRootMetadataPath);
        const statusListMetaDataFiles = statusList.filter(status => status.filePath)
            .map(status => status.filePath);
        const metaDataFilesSet = [...new Set([...metaDataFiles, ...statusListMetaDataFiles])]
        for(const metadataFile of metaDataFilesSet){
            const matchingStatus = statusList.find(status => status.filePath === metadataFile);
            if(!!matchingStatus){
                updatedStatusList.push({
                    Plz_Status__c: 'Not Synchronized',
                    Plz_Name__c: matchingStatus.fullName,
                    Plz_Path__c: matchingStatus.filePath,
                    Plz_type__c: matchingStatus.type,
                })
            }else{
                const resolver = new MetadataResolver();
                const metadata = resolver.getComponentsFromPath(metadataFile);
                const sourceComponent =  metadata.pop();
                updatedStatusList.push({
                    Plz_Status__c: 'Synchronized',
                    Plz_Name__c: sourceComponent.fullName,
                    Plz_Path__c: metadataFile,
                    Plz_type__c: sourceComponent.type.name,
                })
            }//todo add else
        }
        return updatedStatusList;
    }

    private async getAllMetadataFiles(dirPath, arrayOfFiles?): Promise<string[]> {
        let files: string[] = fs.readdirSync(dirPath);
        arrayOfFiles = arrayOfFiles || [];
      
        for(const file of files){
            if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                arrayOfFiles = await this.getAllMetadataFiles(dirPath + "/" + file, arrayOfFiles);
            } else {
                if(path.extname(file) === '.xml'){
                    arrayOfFiles.push(path.join(dirPath, "/", file));
                }
            }
        }
      
        return arrayOfFiles
    }

}
