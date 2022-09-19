import {
  Connection,
  ErrorResult,
  QueryResult,
  Record,
  RecordResult,
  RecordStream,
  SalesforceId,
  SObject,
  SuccessResult,
  UserInfo,
} from "jsforce";
import { SfdcCtx } from "../../Common/context/SfdcCtx";
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
    let errors: string[] = [];
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
      console.log(`creating new ${sobject} ...`);
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
      console.log(`deleting ${sobject} records ${id} ...`);
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
      console.log(`reading ${sobject} data of ${id} ...`);
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
    try {
      return await this.conn.query(soql);
    } catch (e) {
      console.error(
        `unable to execute soql:\n${soql}\ndue to:\n${(e as Error).stack}`
      );
      process.exit(1);
    }
  }
}
