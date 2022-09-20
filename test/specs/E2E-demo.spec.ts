import { faker } from "@faker-js/faker";
import test from "@playwright/test";
import { stringify } from "ajv";
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

test.describe('DMCC demo - E2E flow', () => {
    let mailer: FreezoneMailer;
    let UI: SfdcUiCtx;
    let API: SfdcApiCtx;

    test.describe.configure({ mode: 'serial' });

    test.beforeAll(async () => {
        //mailer = await new FreezoneMailer().Ready;
        UI = await new SfdcUiCtx(Environment.INT, User.LP_LEASING).Ready;
        API = await new SfdcApiCtx(Environment.INT, User.SYSADMIN).Ready;
    });

    test.beforeEach(async({page}) => {
        await test.step('login to SFDC', async () => {
            await UI.loginOn(page);
        });
    });

    test.skip('Create and Convert Lead', async ({page}) => {test.slow();
        await test.step('Create new Lead via UI', async () => {
            await Lead.newByUi(page);
        });

        // await test.step('Create new Lead via API and Navigate to it', async () => {
        //     await UI.navigateToRecord(page, await Lead.newByApi(API));
        // });

        await test.step('Convert Lead', async () => {
            await page.click(HighlightsPanel.CONVERT_BUTTON);
            await page.waitForLoadState('networkidle');
            await page.click(LeadConvert.CONVERT_BUTTON);
            await page.click(LeadConvert.OPPORTUNITY_LINK);
        });

        await test.step('Edit Opportunity', async () => {
            await page.click(Opportunity.NEED_ANALYSIS_STAGE);
            await page.click(Opportunity.MARK_AS_CURRENT_STAGE_BUTTON);
        });

        await test.step('logout from SFDC', async () => {
            await UI.logoutFrom(page);
        });
    });

    test('LP E2E', async ({page}) => {test.slow();

        //create new Case
        await NavigationBar.openApp(page, "Cases");
        // Click a[role="button"]:has-text("New")
        await page.locator('a[role="button"]:has-text("New")').click();
        // Click text=Type--None-- >> a[role="button"]
        await page.locator('text=Type--None-- >> a[role="button"]').click();
        // Click text=Inquiry
        await page.locator('text=Request').click();
        // Click text=Case Origin*--None-- >> a[role="button"]
        await page.locator('text=Case Origin*--None-- >> a[role="button"]').click();
        // Click a[role="menuitemradio"]:has-text("Web")
        await page.locator('a[role="menuitemradio"]:has-text("Web")').click();
        // Click button:has-text("Save") >> nth=3
        await page.locator('button:has-text("Save")').nth(3).click();

        //create new Contact/Account and link it to the Case
        // Click button:has-text("Edit Contact Name")
        await page.locator('button:has-text("Edit Contact Name")').click();
        // Click [placeholder="Search Contacts\.\.\."]
        await page.locator('[placeholder="Search Contacts\\.\\.\\."]').click();
        // Click lightning-base-combobox-item[role="option"]:has-text("AddNew Contact")
        await page.locator('lightning-base-combobox-item[role="option"]:has-text("AddNew Contact")').click();
        // Click [placeholder="Last Name"]
        await page.locator('[placeholder="Last Name"]').click();
        // Fill [placeholder="Last Name"]
        await page.locator('[placeholder="Last Name"]').fill(faker.name.firstName());
        // Click [placeholder="Search Accounts\.\.\."]
        await page.locator('[placeholder="Search Accounts\\.\\.\\."]').click();
        // Click div[role="option"]:has-text("New Account")
        await page.locator('div[role="option"]:has-text("New Account")').click();
        await page.locator("//input[ancestor::*[preceding-sibling::label[descendant::*[text()='Account Name']]] and ancestor::*[preceding-sibling::*[descendant::h2[text()='New Account']]]]").fill(faker.company.name());
        await page.locator("//button[@title='Save' and ancestor::*[preceding-sibling::*[descendant::h2[text()='New Account']]]]").click();
        await page.waitForLoadState('networkidle');
        await page.locator("//button[@title='Save' and ancestor::*[preceding-sibling::*[descendant::h2[text()='New Contact']]]]").click();
        await page.waitForLoadState('networkidle');
        await page.locator("//button[@name='SaveEdit']").click();
        await page.waitForLoadState('networkidle');

        //enable Account and Contact as partner
        await page.click("//force-lookup[ancestor::*[preceding-sibling::*[contains(@class, 'label-container') and descendant::*[text()='Account Name']]]]");
        await page.click("//button[text()='Enable As Partner']");
        await page.click("//button[@title='Enable As Partner']");
        await page.goBack();
        await page.click("//force-lookup[ancestor::*[preceding-sibling::*[contains(@class, 'label-container') and descendant::*[text()='Contact Name']]]]");
        await page.click("//button[text()='Enable Partner User']");
        const iframe = "//iframe[contains(@title, 'New User')]";
        const LpCommunityUserProfileId = (await API.query("select id from profile where name = 'LP Partner Community Login User'") as any).records[0].Id.substring(0,15);
        await page.frameLocator(iframe).locator('select[name="Profile"]').selectOption(LpCommunityUserProfileId);
        await page.frameLocator(iframe).locator("//input[@id='Email']").fill(faker.internet.email());
        await page.frameLocator(iframe).locator("(//input[@title='Save'])[last()]").click();
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