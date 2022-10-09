import { Page } from "@playwright/test";
import { LoginPage } from "../../locators/sfdc/LoginPage";
import { UserCredentials } from "../common/credentials/structures/SalesforceCredentialsStructure";
import { Environment } from "../common/credentials/structures/Environment";
import { User } from "../common/credentials/structures/User";
import { SfdcCtx } from "../common/context/SfdcCtx";

export class SfdcUiCtx extends SfdcCtx {
    public readonly Ready: Promise<this>;

    constructor(environment: Environment, user: User) {
        super(environment, user);
        this.Ready = new Promise(async (makeReady) => {
            await super.initialized;
            makeReady(this);
        })
    }

    public async navigateToRecord(page: Page, id: string, removeSlash?: boolean): Promise<void> {
        const recordUri = await this.credentials
            .environmentDataFor(this.environment).baseUrl
            + (removeSlash ? "" : "/")
            + id;
        await page.goto(recordUri, {waitUntil: 'networkidle'});
    }

    public async loginOn(page: Page): Promise<void> {
        const credentials: UserCredentials = await this.credentials
            .userCredentialsFor(this.environment, this.user);
        const baseUrl: string = await this.credentials
            .environmentDataFor(this.environment).baseUrl;
        await LoginPage.authenticateUsing(page, baseUrl, credentials);
    }

    public async logoutFrom(page: Page): Promise<void> {
        const baseUrl: string = await this.credentials
            .environmentDataFor(this.environment).baseUrl;
        await page.goto(`${baseUrl}/secur/logout.jsp`, { waitUntil: 'networkidle' });
    }
}