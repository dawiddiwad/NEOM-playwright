import { Page } from "@playwright/test";
import { UserCredentials } from "../../utils/common/credentials/structures/SalesforceCredentialsStructure";

export class LoginPage {
    public static readonly USERNAME: string = "//input[@id='username']";
    public static readonly PASSWORD: string = "//input[@id='password']";
    public static readonly LOGIN_BUTTON: string = "//input[@id='Login']";

    public static async authenticateUsing(page: Page, url: string, credentials: UserCredentials): Promise<void> {
        await page.goto(url);
        await page.fill(this.USERNAME, credentials.username);
        await page.fill(this.PASSWORD, credentials.password);
        await page.click(this.LOGIN_BUTTON);
    }
}