import { SalesforceCredentialsHandler } from "../credentials/SalesforceCredentialsHandler";
import { Environment } from "../credentials/structures/Environment";
import { User } from "../credentials/structures/User";

export abstract class SfdcCtx {
    protected credentials: SalesforceCredentialsHandler;
    protected initialized: Promise<this>;

    public readonly user: User;
    public readonly environment: Environment;

    constructor(environment: Environment, user: User) {
        this.environment = environment;
        this.user = user;
        this.initialized = new Promise(async (makeReady) => {
            this.credentials = await new SalesforceCredentialsHandler().Ready;
            makeReady(this);
        })
    }
}