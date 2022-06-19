import { StatusRowRecord } from "./StatusRowRecord";
import { StatusRowRequest } from "./StatusRowRequest";

export interface NewOldRecords {
    newRecords : StatusRowRequest[],
    existingRecord : StatusRowRecord[],
}