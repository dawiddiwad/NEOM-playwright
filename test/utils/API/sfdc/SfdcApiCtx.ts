import {
  Connection,
  ErrorResult,
  ExecuteAnonymousResult,
  QueryResult,
  Record,
  RecordResult,
  RecordStream,
  SalesforceId,
  SObject,
  SuccessResult,
  UserInfo,
  ExecuteOptions
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
    this.conn = new Connection({loginUrl: 'https://test.salesforce.com'});
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

  private checkForErrors(data: RecordResult[]): SuccessResult[] {
    let errors: any[] = [];
    data.forEach((result) => {
      if (!result.success) {
        (result as ErrorResult).errors.forEach((error) => errors.push(error));
      }
    });
    if (errors.length > 0) {
      throw new Error(`jsforce failed on: ${JSON.stringify(errors)}`);
    } else return data as SuccessResult[];
  }

  public async create(
    sobject: string,
    data: Object | Array<Object>
  ): Promise<SuccessResult | SuccessResult[]> {
    try {
      const results = await this.conn.create(sobject, data, {
        allOrNone: true,
      });
      if (results instanceof Array) {
        return this.checkForErrors(results);
      } else {
        return results as SuccessResult;
      }
    } catch (e) {
      console.error(
        `unable to create ${sobject} due to:\n${(e as Error).stack}`
      );
      process.exit(1);
    }
  }

  public async delete(
    sobject: string,
    id: SalesforceId | SalesforceId[]
  ): Promise<RecordResult | RecordResult[]> {
    try {
      const results = await this.conn.delete(sobject, id);
      if (results instanceof Array) {
        return this.checkForErrors(results);
      } else {
        return results as SuccessResult;
      }
    } catch (e) {
      console.error(
        `unable to delete ${sobject} due to:\n${(e as Error).stack}`
      );
      process.exit(1);
    }
  }

  public async read(
    sobject: string,
    id: SalesforceId | SalesforceId[]
  ): Promise<Record | Record[]> {
    try {
      const result = await this.conn.retrieve(sobject, id);
      return result;
    } catch (e) {
      console.error(
        `unable to read ${sobject} record ${id} due to:\n${
          (e as Error).stack
        }`
      );
      process.exit(1);
    }
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
    const result: ExecuteAnonymousResult = await this.conn.tooling.executeAnonymous(apexBody, function(err, res) {
      if (err) {
        throw new Error(`unable to execute anonymous apex:\n${apexBody}\ndue to:\n${(err as Error).stack}`);
      }
    });

    if (!result.success){
      throw new Error(`exception running anonymous apex:\n${apexBody}\ndue to:\n${result.exceptionMessage}\n${result.exceptionStackTrace}`);
    } else return result;
  }
}
