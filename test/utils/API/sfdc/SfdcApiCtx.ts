import {
  Connection,
  ExecuteAnonymousResult,
  QueryResult,
  Record,
  RecordResult,
  SalesforceId,
  UserInfo,
  MetadataInfo
} from "jsforce";
import { SfdcCtx } from "../../common/context/SfdcCtx";
import { Environment } from "../../common/credentials/structures/Environment";
import { User } from "../../common/credentials/structures/User";

export class SfdcApiCtx extends SfdcCtx {
  private conn: Connection;
  public userInfo!: UserInfo;
  public readonly Ready: Promise<this>;

  constructor(environment: Environment, user: User) {
    super(environment, user);
    this.conn = new Connection({loginUrl: 'https://test.salesforce.com', version: "54.0"});
    this.Ready = new Promise<this>(async (connected, failure) => {
      try {
        await this.initialized;
        const credentials = await this.credentials.userCredentialsFor(
          this.environment,
          this.user
        );
        this.userInfo = await this.conn.login(
          credentials.username,
          credentials.password
        );
        connected(this);
      } catch (e) {
        console.error(
          `unable to initialize SFDC API due to:\n${(e as Error).stack}`
        );
        failure(e);
      }
    });
  }

  public async create(sobject: string, data: object | object[]): Promise<RecordResult | RecordResult[]> {
    return this.conn.create(sobject, data, {allOrNone: true}, (err, result) => {
      if (err){
        throw new Error(`unable to create ${sobject} due to:\n${(err as Error).stack}`);
      } else return result;
    });
  }

  public async delete(sobject: string, id: SalesforceId | SalesforceId[]): Promise<RecordResult | RecordResult[]> {
    return await this.conn.delete(sobject, id, null, (err, result) => {
      if (err) {
        throw new Error(`unable to delete ${sobject} record ${id} due to:\n${(err as Error).stack}`);
      } else return result;
    });
  }

  public async read(sobject: string, id: SalesforceId | SalesforceId[]): Promise<Record | Record[]> {
    return await this.conn.retrieve(sobject, id, null, (err, result) => {
      if (err) {
        throw new Error(`unable to read ${sobject} record ${id} due to:\n${(err as Error).stack}`);
      } else return result;
    });
  }

  public async query(soql: string): Promise<QueryResult<unknown>> {
    return await this.conn.query(soql, undefined, function(err, res) {
      if (err) {
        throw new Error(`unable to execute soql:\n${soql}\ndue to:\n${(err as Error).stack}`);
      } else if (!res.records.length){
        throw new Error(`no records returned by soql:\n${soql}}`);
      } else return res;
    });
  }

  public async executeApex(apexBody: string): Promise<ExecuteAnonymousResult> {
    return this.conn.tooling.executeAnonymous(apexBody, function(err, result) {
      if (err) {
        throw new Error(`unable to execute anonymous apex:\n${apexBody}\ndue to:\n${(err as Error).stack}`);
      } else if (!result.success){
        throw new Error(`exception running anonymous apex:\n${apexBody}\ndue to:\n${result.exceptionMessage}\n${result.exceptionStackTrace}`);
      } else return result;
    });
  }

  public async readRecordUi(recordId: string): Promise<MetadataInfo | MetadataInfo[]> {
    return this.conn.request({method:'Get', url: `/ui-api/record-ui/${recordId}`}, null, (err, result) => {
      if (err){
        throw new Error(`unable to retrieve /ui-api/record-ui/${recordId} due to:\n${(err as Error).stack}`);
      } else return result;
    });
  }

  public async readRelatedListsUi(object: string, recordTypeId?: string): Promise<MetadataInfo | MetadataInfo[]> {
    recordTypeId = recordTypeId ? `?recordTypeId=${recordTypeId}` : '';
    const resource = `/ui-api/related-list-info/${object}${recordTypeId}`;
    return this.conn.request({method:'Get', url: resource}, null, (err, result) => {
      if (err){
        throw new Error(`unable to retrieve ${resource} due to:\n${(err as Error).stack}`);
      } else return result;
    });
  }
}
