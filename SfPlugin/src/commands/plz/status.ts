import { flags, SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';
import SyncLib from '../../lib/sync/syncLib';
import { FlagsPayload } from '../../lib/types';


export default class status extends SfdxCommand {

  public static args = [{ name: 'file' }];

  protected static flagsConfig = {
    interactive: flags.boolean({
      char: 'o',
      description: 'Pass this flag if you want to run the interactive option for syncing components',
      required: false,
    })
  };

  protected static requiresUsername = true;
  protected static requiresProject = true;

  public async run(): Promise<AnyJson> {
    const flagsPayload : FlagsPayload = { interactive: this.flags.interactive || false, saveRecords: this.flags.save || false };
    const syncLib = new SyncLib(this.org, this.project, flagsPayload);
    syncLib.run();
    return { success: true };
  }
}
