export interface StatusOutputRow {
    type: string;
    origin: 'local' | 'remote';
    state: 'add' | 'delete' | 'modify' | 'nondelete';
    fullName: string;
    filePath?: string;
    conflict?: boolean;
    ignored?: boolean;
}