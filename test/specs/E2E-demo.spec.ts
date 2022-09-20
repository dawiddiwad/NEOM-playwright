import { faker } from "@faker-js/faker";
import test from "@playwright/test";
import { stringify } from "ajv";
import { QueryResult } from "jsforce";
import { ApplicantDetails } from "../locators/portal/ApplicantDetails";
import { BeforeStarting } from "../locators/portal/BeforeStarting";
import { FreezoneLogin } from "../locators/portal/FreezoneLogin";
import { Home } from "../locators/portal/Home";
import { Signup } from "../locators/portal/Signup";
import { Lead } from "../locators/sfdc/editview/Lead";
import { Opportunity } from "../locators/sfdc/editview/Opportunity";
import { HighlightsPanel } from "../locators/sfdc/HighlightsPanel";
import { LeadConvert } from "../locators/sfdc/LeadConvert";
import { ListView } from "../locators/sfdc/ListView";
import { Modal } from "../locators/sfdc/Modal";
import { NavigationBar } from "../locators/sfdc/NavigationBar";
import { StagesPath } from "../locators/sfdc/StagesPath";
import { FreezoneMailer } from "../utils/API/gmail/FreezoneMailer";
import { SfdcApiCtx } from "../utils/API/sfdc/SfdcApiCtx";
import { Environment } from "../utils/common/credentials/structures/Environment";
import { User } from "../utils/common/credentials/structures/User";
import { SfdcUiCtx } from "../utils/UI/SfdcUiCtx";

test.describe('NEOM test automation demo - LP E2E flow', () => {
    let mailer: FreezoneMailer;
    let UI_LP_LEASING: SfdcUiCtx;
    let UI_SYSADMIN: SfdcUiCtx;
    let API_SYSADMIN: SfdcApiCtx;
    let leaseeUsername;
    let leaseePassword;

    test.describe.configure({ mode: 'serial' });

    test.beforeAll(async () => {
        UI_LP_LEASING = await new SfdcUiCtx(Environment.INT, User.LP_LEASING).Ready;
        UI_SYSADMIN = await new SfdcUiCtx(Environment.INT, User.SYSADMIN).Ready;
        API_SYSADMIN = await new SfdcApiCtx(Environment.INT, User.SYSADMIN).Ready;
        leaseeUsername = faker.internet.email(); console.debug(leaseeUsername);
        leaseePassword = faker.internet.password(); console.debug(leaseePassword);
    });

    test('Leasing Team enables new Customer', async ({page}) => {test.slow();
        await test.step('login to SFDC as LP Leasing Team', async () => {
            await UI_LP_LEASING.loginOn(page);
        });

        await test.step('Create new Case', async () => {
            await NavigationBar.openApp(page, "Cases");
            await page.locator('a[role="button"]:has-text("New")').click();
            await page.locator('text=Type--None-- >> a[role="button"]').click();
            await page.locator('text=Request').click();
            await page.locator('text=Case Origin*--None-- >> a[role="button"]').click();
            await page.locator('a[role="menuitemradio"]:has-text("Web")').click();
            await page.locator('button:has-text("Save")').nth(3).click();
        });

        await test.step('Create new Contact/Account and link it to the Case', async () => {
            await page.locator('button:has-text("Edit Contact Name")').click();
            await page.locator('[placeholder="Search Contacts\\.\\.\\."]').click();
            await page.locator('lightning-base-combobox-item[role="option"]:has-text("AddNew Contact")').click();
            await page.locator('[placeholder="Last Name"]').click();
            await page.locator('[placeholder="Last Name"]').fill(faker.name.firstName());
            await page.locator('[placeholder="Search Accounts\\.\\.\\."]').click();
            await page.locator('div[role="option"]:has-text("New Account")').click();
            await page.locator("//input[ancestor::*[preceding-sibling::label[descendant::*[text()='Account Name']]] and ancestor::*[preceding-sibling::*[descendant::h2[text()='New Account']]]]").fill(faker.company.name());
            await page.locator("//button[@title='Save' and ancestor::*[preceding-sibling::*[descendant::h2[text()='New Account']]]]").click();
            await page.waitForLoadState('networkidle');
            await page.locator("//button[@title='Save' and ancestor::*[preceding-sibling::*[descendant::h2[text()='New Contact']]]]").click();
            await page.waitForLoadState('networkidle');
            await page.locator("//button[@name='SaveEdit']").click();
            await page.waitForLoadState('networkidle');
        });

        await test.step('Enable Account and Contact as Partner', async () => {
            await page.click("//force-lookup[ancestor::*[preceding-sibling::*[contains(@class, 'label-container') and descendant::*[text()='Account Name']]]]");
            await page.click("//button[text()='Enable As Partner']");
            await page.click("//button[@title='Enable As Partner']");
            await page.goBack();
            await page.click("//force-lookup[ancestor::*[preceding-sibling::*[contains(@class, 'label-container') and descendant::*[text()='Contact Name']]]]");
            await page.click("//button[text()='Enable Partner User']");
            const iframe = "//iframe[contains(@title, 'New User')]";
            const LpCommunityUserProfileId = (await API_SYSADMIN.query("select id from profile where name = 'LP Partner Community Login User'") as QueryResult<any>).records[0].Id.substring(0,15);
            await page.frameLocator(iframe).locator('select[name="Profile"]').selectOption(LpCommunityUserProfileId);
            await page.frameLocator(iframe).locator("//input[@id='Email']").fill(leaseeUsername);
            await page.frameLocator(iframe).locator("(//input[@title='Save'])[last()]").click();
        });
    });

    test('Leasee fills out application', async ({page}) => {test.slow();
        await test.step('Login to Portal', async() => {
            const leaseeUserId = (await API_SYSADMIN.query(`select id from user where username = '${leaseeUsername}'`) as QueryResult<any>).records[0].Id;
            await API_SYSADMIN.executeApex(`System.setPassword('${leaseeUserId}','${leaseePassword}');`);
            const lpPortalSiteId = (await API_SYSADMIN.query("select id from site where name = 'Logistics_Park'") as QueryResult<any>).records[0].Id;
            const lpPortalSiteUrl = (await API_SYSADMIN.query(`select SecureUrl from sitedetail where durableid = '${lpPortalSiteId}'`) as QueryResult<any>).records[0].SecureUrl;
            await page.goto(lpPortalSiteUrl);
            await page.fill("//input[@placeholder='Username']", leaseeUsername??"missing");
            await page.fill("//input[@placeholder='Password']", leaseePassword??"missing");
            await page.click("//button[descendant::*[text()='Log in']]");
            await page.waitForTimeout(5000);
        });
    });

    test.skip('Leasing Team processes Opportunity until Document Approval', async ({page}) => {test.slow();
    });

    test.skip('Approval team reviews Approval Request', async ({page}) => {test.slow();
    });

    test.skip('Leasing Team finnishes Opportunity processing', async ({page}) => {test.slow();
    });

    test.skip('Portal flow until 1st payemnt', async ({page}) => {test.slow();
        let username;
        await test.step('Signup Password', async () => {
            await page.goto(await mailer.latestSignupLink(), {waitUntil: 'networkidle'});
            await page.fill(Signup.PASSWORD, Signup.commonPassword());
            await page.fill(Signup.PASSWORD_CONFIRM, Signup.commonPassword());
            await page.click(Signup.SIGNUP_BUTTON);
        });
        await test.step('Singup OTP', async () => {
            await Signup.enterOTP(page, await mailer.latestSignupCode());
            await page.click(Signup.CONTINUE_BUTTON);
            username = FreezoneLogin.registeredUsernameFrom(await page.textContent(FreezoneLogin.USERNAME_BOX)??"");
            await page.click(Signup.GO_TO_LOGIN_BUTTON);
        });
        await test.step('Login to Portal', async () => {
            await page.fill(FreezoneLogin.USERNAME, username);
            await page.fill(FreezoneLogin.PASSWORD, Signup.commonPassword());
            await page.click(FreezoneLogin.LOGIN_BUTTON);
        });
        await test.step('Before Starting page', async () => {
            await page.click(Home.CONTINUE_APPLICATION_BUTTON);
            await page.click(BeforeStarting.TERMS_AND_CONDITIONS_LINK);
            await page.click(BeforeStarting.TERMS_AND_CONDITIONS_ACCEPT_BUTTON);
            await page.click(BeforeStarting.CONTINUE_BUTTON);
        });
        await test.step('Applicant Details', async () => {
            await page.click(ApplicantDetails.CONSULTANT_OPTION_BUTTON);
            await page.setInputFiles(ApplicantDetails.UPLOAD_LETTER_INPUT, './test/uploads/elephant.jpg');
            await page.click(ApplicantDetails.UPLOAD_DONE_BUTTON);
            await page.setInputFiles(ApplicantDetails.UPLOAD_PASSPORT_INPUT, './test/uploads/elephant.jpg');
            await page.click(ApplicantDetails.UPLOAD_DONE_BUTTON);
        });
        await test.step('TBC...', async () => {
            await page.waitForLoadState('networkidle');
        });
    });
});