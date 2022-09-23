import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";
import { stringify } from "ajv";
import { MetadataInfo, QueryResult, RecordResult, SuccessResult } from "jsforce";
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
import { writeFile, readFile } from "fs/promises";
import { UiApi } from "../utils/API/sfdc/UiApi";

test.describe.serial('NEOM test automation demo - LP E2E flow', () => {
    let mailer: FreezoneMailer;
    let UI_LP_LEASING: SfdcUiCtx;
    let UI_LP_APPROVER: SfdcUiCtx;
    let UI_SYSADMIN: SfdcUiCtx;
    let API_SYSADMIN: SfdcApiCtx;
    let API_LP_LEASING: SfdcApiCtx;
    let leaseeUsername;
    let leaseeApp;
    let contactName;
    let accountName;

    test.beforeAll(async () => {
        // UI_LP_LEASING = await new SfdcUiCtx(Environment.INT, User.LP_LEASING).Ready;
        // UI_LP_APPROVER = await new SfdcUiCtx(Environment.INT, User.LP_APPROVER).Ready;
        // UI_SYSADMIN = await new SfdcUiCtx(Environment.INT, User.SYSADMIN).Ready;
        API_SYSADMIN = await new SfdcApiCtx(Environment.INT, User.SYSADMIN).Ready;
        API_LP_LEASING = await new SfdcApiCtx(Environment.INT, User.LP_LEASING).Ready;
        // leaseeUsername = faker.internet.email();
        // contactName = faker.name.firstName();
        // accountName = `${faker.commerce.productName()} ${faker.company.companySuffix()}`;
    });

    test('Leasing Team enables new Customer', async ({page}) => {
        await test.step('login to SFDC as LP Leasing Team', async () => {
            await UI_LP_LEASING.loginOn(page);
            await page.waitForLoadState('networkidle');
        });

        await test.step('Create new Case', async () => {
            const lpCaseRecordTypeId = (await API_SYSADMIN.query("select id from recordtype where name = 'LP Case'") as QueryResult<any>).records[0].Id;
            const lpLeasingTeamQueueId = (await API_SYSADMIN.query("select id from Group where DeveloperName = 'Leasing_Team'") as QueryResult<any>).records[0].Id;
            const lpCaseData = {
                Origin: "Web",
                Status: "New",
                Type: "Request",
                RecordTypeId: lpCaseRecordTypeId,
                OwnerId: lpLeasingTeamQueueId
            }
            const lpCaseId = (await API_SYSADMIN.create("Case", lpCaseData) as SuccessResult).id;
            await UI_LP_LEASING.navigateToRecord(page, lpCaseId);
        });

        await test.step('Create new Contact/Account and link it to the Case', async () => {
            await page.locator('button:has-text("Edit Contact Name")').click();
            await page.locator('[placeholder="Search Contacts\\.\\.\\."]').click();
            await page.locator('lightning-base-combobox-item[role="option"]:has-text("AddNew Contact")').click();
            await page.locator('[placeholder="Last Name"]').click();
            await page.locator('[placeholder="Last Name"]').fill(contactName);
            await page.locator('[placeholder="Search Accounts\\.\\.\\."]').click();
            await page.locator('div[role="option"]:has-text("New Account")').click();
            await page.locator("//input[ancestor::*[preceding-sibling::label[descendant::*[text()='Account Name']]] and ancestor::*[preceding-sibling::*[descendant::h2[text()='New Account']]]]").fill(accountName);
            await page.locator("(//button[@title='Save' and ancestor::*[preceding-sibling::*[descendant::h2[text()='New Account']]]])[last()]").click();
            await page.waitForLoadState('networkidle');
            await page.locator("(//button[@title='Save' and ancestor::*[preceding-sibling::*[descendant::h2[text()='New Contact']]]])[last()]").click();
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
            await page.waitForLoadState('networkidle');
        });
    });

    test('Leasee sends out application', async ({page}) => {
        async function getLeaseeId (username: string, acc?: number): Promise<void> {
            if (acc && acc > 10){
                throw new Error(`unable to find Leasee User: ${username}`);
            }
            try {
                return (await API_SYSADMIN.query(`select id from user where username = '${leaseeUsername}'`) as QueryResult<any>).records[0].Id;
            } catch (error) {
                if ((error as Error).message.includes('no records returned')){
                    await page.waitForTimeout(1000);
                    return getLeaseeId(username, (acc ? ++acc : 1));
                } else throw error;
            }
        }

        await test.step('Login to Portal', async() => {
            const leaseeUserId = await getLeaseeId(leaseeUsername);
            const lpNetworkId = (await API_SYSADMIN.query("select id from Network where name = 'Logistics_Park'") as QueryResult<any>).records[0].Id;
            const orgId = (await API_SYSADMIN.query("select id from Organization") as QueryResult<any>).records[0].Id;

            await UI_SYSADMIN.loginOn(page);
            await page.waitForLoadState('networkidle');
            await UI_SYSADMIN.navigateToRecord(page, `/servlet/servlet.su?oid=${orgId}&retURL=%2F${leaseeUserId}&sunetworkid=${lpNetworkId}&sunetworkuserid=${leaseeUserId}`);
        });

        await test.step('Fill new Application Form', async() => {
            await page.locator('text=New Application').click();
            await page.waitForLoadState('networkidle');
            await page.fill("//input[ancestor::*[preceding-sibling::label[text()='Phone']]]", faker.phone.number('###-###-###'));
            await page.fill("//input[ancestor::*[preceding-sibling::label[text()='Street']]]", faker.address.streetAddress());
            await page.fill("//input[ancestor::*[preceding-sibling::label[text()='City']]]", faker.address.city());
            await page.fill("//input[ancestor::*[preceding-sibling::label[text()='Postal Code']]]", faker.address.zipCode());
            await page.fill("//input[ancestor::*[preceding-sibling::label[text()='Country']]]", faker.address.country());
            await page.locator('text=Laydown Yard AssetsOther Laydown Yard Assets >> [placeholder="Select an option"]').click();
            await page.locator('text=Plot').click();
            await page.locator('text=Batch Plant AssetsOther Batch Plant Assets >> [placeholder="Select an option"]').click();
            await page.locator('text=Laboratory').click();
            await page.locator('[aria-label="Size of the Area \\(sqm\\)\\, Select size of the area"]').click();
            await page.locator('span:has-text("5000 - 10000")').nth(1).click()
            await page.locator('text=*I hereby acknowledge that I have read, understand, and acknowledge for full com >> span').first().click();
            await page.locator('text=Continue').click();
            await page.waitForLoadState('networkidle');
        });

        await test.step('Upload Documents', async() => {
            await page.setInputFiles("//span[contains(@class,'file-selector__button') and ancestor::slot[descendant::*[text()='Overall Company Profile']]]", './test/uploads/document.pdf');
            await page.click("//button[descendant::*[text()='Done']]");
            await page.setInputFiles("//span[contains(@class,'file-selector__button') and ancestor::slot[descendant::*[text()='ZATCA Certificate']]]", './test/uploads/document.pdf');
            await page.click("//button[descendant::*[text()='Done']]");
            await page.setInputFiles("//span[contains(@class,'file-selector__button') and ancestor::slot[descendant::*[text()='Saudization Certificate']]]", './test/uploads/document.pdf');
            await page.click("//button[descendant::*[text()='Done']]");
            await page.setInputFiles("//span[contains(@class,'file-selector__button') and ancestor::slot[descendant::*[text()='Authorization Letter']]]", './test/uploads/document.pdf');
            await page.click("//button[descendant::*[text()='Done']]");
            await page.setInputFiles("//span[contains(@class,'file-selector__button') and ancestor::slot[descendant::*[text()='Conflict of Interest Form']]]", './test/uploads/document.pdf');
            await page.click("//button[descendant::*[text()='Done']]");
            await page.setInputFiles("//span[contains(@class,'file-selector__button') and ancestor::slot[descendant::*[text()='Commercial Registration Certificate']]]", './test/uploads/document.pdf');
            await page.click("//button[descendant::*[text()='Done']]");
            await page.setInputFiles("//span[contains(@class,'file-selector__button') and ancestor::slot[descendant::*[text()='Valid VAT Registration Certificate']]]", './test/uploads/document.pdf');
            await page.click("//button[descendant::*[text()='Done']]");
            await page.setInputFiles("//span[contains(@class,'file-selector__button') and ancestor::slot[descendant::*[text()='Bank Details']]]", './test/uploads/document.pdf');
            await page.click("//button[descendant::*[text()='Done']]");
            await page.setInputFiles("//span[contains(@class,'file-selector__button') and ancestor::slot[descendant::*[text()='NEOM Non-Disclosure Agreement']]]", './test/uploads/document.pdf');
            await page.click("//button[descendant::*[text()='Done']]");
            await page.setInputFiles("//span[contains(@class,'file-selector__button') and ancestor::slot[descendant::*[text()='General Organization for Social Insuranc']]]", './test/uploads/document.pdf');
            await page.click("//button[descendant::*[text()='Done']]");
            await page.waitForLoadState('networkidle');
        });

        await test.step('Submit Application', async () => {
            await page.waitForTimeout(2000);
            await page.click('text=Submit Application');
            await page.waitForLoadState('networkidle');
        });
    });

    test('Leasing Team processes Opportunity until Document Approval', async ({page}) => {
        await test.step('login to SFDC as LP Leasing Team', async () => {
            await UI_LP_LEASING.loginOn(page);
            await page.waitForLoadState('networkidle');
        });

        await test.step('Navigate to recently Submitted Opportunity', async () => {
            leaseeApp = (await API_SYSADMIN.query(`select id, name from Opportunity where CreatedBy.Username = '${leaseeUsername}' and Application_Status__c = 'Submitted' order by CreatedDate desc limit 1`) as QueryResult<any>).records[0];
            await UI_LP_LEASING.navigateToRecord(page, leaseeApp.Id);
        });

        await test.step('Eligibility check', async () => {
            await page.click("//a[@data-tab-name='Eligibility']");
            await page.click("//button[descendant::*[text()='Mark as Current Stage']]");
            await page.waitForLoadState('networkidle');
            await page.click("//a[@data-label='Scoring']");
            await page.mouse.wheel(0, 800); 
            await page.waitForLoadState('networkidle');
            await page.click("//button[@title='Edit No. of Years in the Industry']");
            await page.fill("//input[preceding-sibling::*[descendant::*[text()='No. of Years in the Industry']]]", "10");
            await page.press("//a[ancestor::*[preceding-sibling::span[descendant::*[text()='Business with NEOM']]]]", 'Enter'); await page.waitForTimeout(1000);
            await page.click("//a[text()='Yes']", {force: true,});
            await page.press("//a[ancestor::*[preceding-sibling::span[descendant::*[text()='Clients']]]]", 'Enter'); await page.waitForTimeout(1000);
            await page.click("//a[text()='Major']", {force: true,});
            await page.press("//a[ancestor::*[preceding-sibling::span[descendant::*[text()='Financial Statement']]]]", 'Enter'); await page.waitForTimeout(1000);
            await page.click("//a[text()='Provided']", {force: true,});
            await page.press("//a[ancestor::*[preceding-sibling::span[descendant::*[text()='Type']]]]", 'Enter'); await page.waitForTimeout(1000);
            await page.click("//a[text()='NEOM Function']", {force: true,});
            await page.press("//a[ancestor::*[preceding-sibling::span[descendant::*[text()='Account Type - Score']]]]", 'Enter'); await page.waitForTimeout(1000);
            await page.click("//a[text()='6']", {force: true,});
            await page.check("//input[preceding-sibling::*[descendant::*[text()='Overall Company Profile']]]");
            await page.check("//input[preceding-sibling::*[descendant::*[text()='Commercial Registration Certificate']]]");
            await page.check("//input[preceding-sibling::*[descendant::*[text()='Valid VAT Registration Certificate']]]");
            await page.check("//input[preceding-sibling::*[descendant::*[text()='General Org. for Social Insurance']]]");
            await page.check("//input[preceding-sibling::*[descendant::*[text()='Saudization Certificate']]]");
            await page.check("//input[preceding-sibling::*[descendant::*[text()='Health, Safety and Environmental Plan']]]");
            await page.check("//input[preceding-sibling::*[descendant::*[text()='Accredited ISO 9001 Certification']]]");
            await page.check("//input[preceding-sibling::*[descendant::*[text()='Local Content']]]");
            await page.check("//input[preceding-sibling::*[descendant::*[text()='NEOM Approved Vendor']]]");
            await page.click("//button[@title='Save']");
            await page.waitForLoadState('networkidle');
            await page.reload();
        });

        await test.step('Document Review', async () => {
            await page.click("//a[@data-tab-name='Document Review']");
            await page.click("//button[descendant::*[text()='Mark as Current Stage']]");
            await page.waitForLoadState('networkidle');
            await page.reload();
            await page.click("//button[text()='Submit for approval']");
            await page.click("//button[contains(@class,'flow-button__FINISH')]");
        })
    });

    test('Approval team reviews Approval Request', async ({page}) => {
        let approvalRequests;
        await test.step('retrieve Approval Requests for the Opportunity', async () => {
            approvalRequests = (await API_SYSADMIN.query(`select id from Approval_Request__c where Opportunity__r.Id = '${leaseeApp.Id}' and Status__c = 'Submitted'`) as QueryResult<any>).records;
            expect(approvalRequests).toHaveLength(7);
        });

        await test.step('login to SFDC as LP Approver', async () => {
            await UI_LP_APPROVER.loginOn(page);
            await page.waitForLoadState('networkidle');
        });

        await test.step('Approve all Approval Requests', async () => {
            for (const record of approvalRequests){
                await UI_LP_APPROVER.navigateToRecord(page, record.Id);
                await page.click("//a[@title='Approve']");
                await page.fill("//textarea[@role='textbox']", "approved by test automation");
                await page.click("//button[descendant::*[text()='Approve']]");
                await page.waitForLoadState('networkidle');
            }
        });
    });

    test('Leasing Team finalizes Opportunity process', async ({page}) => {
        await test.step('login to SFDC as LP Leasing Team', async () => {
            await UI_LP_LEASING.loginOn(page);
            await page.waitForLoadState('networkidle');
        });

        await test.step('Navigate to recently Submitted Opportunity', async () => {
            await UI_LP_LEASING.navigateToRecord(page, leaseeApp.Id);
        });

        await test.step('Contract Activation', async() => {
            const oppOwnerName = (await API_SYSADMIN.query(`select Id, Owner.Name from Opportunity where id = '${leaseeApp.Id}'`) as QueryResult<any>).records[0].Owner.Name;
            await page.click("//a[@data-tab-name='Contract Approval']");
            await page.click("//button[descendant::*[text()='Mark as Current Stage']]");
            await page.click("//button[@name='Opportunity.Create_Contract']");
            await page.click("//button[text()='Create Contract' and contains(@class,'flow-button__NEXT')]");
            await page.waitForLoadState('networkidle');
            await page.reload();
            await page.click("//a[ancestor::*[preceding-sibling::*[contains(@class,'test-id__field-label-container') and descendant::span[text()='Contract']]]]");
            await page.click("//a[@title='Edit']");
            await page.fill("//input[ancestor::*[preceding-sibling::label[descendant::*[text()='Contract Start Date']]]]", "01/01/2049");
            await page.fill("//input[ancestor::*[preceding-sibling::label[descendant::*[text()='Contract End Date']]]]", "01/01/2050");
            await page.fill("//input[ancestor::*[preceding-sibling::label[descendant::*[text()='Customer Signed By']]]]", contactName);
            await page.click(`(//a[@role='option' and descendant::*[contains(text(),'${contactName}')] and ancestor::*[preceding-sibling::label[descendant::*[text()='Customer Signed By']]]])[1]`);
            await page.fill("//input[ancestor::*[preceding-sibling::label[descendant::*[text()='Company Signed By']]]]", oppOwnerName);
            await page.click(`//*[@title='${oppOwnerName}']`);
            await page.click("//button[@title='Save']");
            await page.click("//a[@data-tab-name='Activated']");
            await page.click("//button[descendant::*[text()='Mark as Current Status']]");
        })

        await test.step('Close Opportunity', async() => {
            await UI_LP_LEASING.navigateToRecord(page, leaseeApp.Id);
            await page.click("//a[@data-tab-name='Closed']");
            await page.click("//button[descendant::*[text()='Select Closed Stage']]");
            await page.click("//button[text()='Done']");
        })
    });

    test.only('debug metadata', async () => {
        console.log(await UiApi.readLayoutFromOrg("0066D000006gaEHQAY", API_LP_LEASING));
        await UiApi.wirteLayoutSectionsToFileFromOrg('./layoutSO.json', "0066D000006gaEHQAY", API_LP_LEASING);
        const layoutSO = await UiApi.parseDataFromFile('./layoutSO.json');
        const layoutINT = await UiApi.parseDataFromFile('./layoutINT.json');
        UiApi.layoutCompare(layoutSO, layoutINT);

        // // // const recordId = '0063H000009i6jFQAQ'; //int
        // // const recordId = '0066D000006gaEHQAY'; //so
        // // const result: any = (await API_LP_LEASING.readRecordUI(recordId));
        // // let i = 0;
        // // console.log(Object.keys(result.records[recordId].fields).length);
        // // console.log(Object.keys(result));

        // // // const fieldsINT = JSON.stringify(Object.keys(result.records[recordId].fields)).replace(/[a-zA-Z0-9]{18}/gm,"");
        // // // const layoutINT = JSON.stringify((Object.values(result.layouts.Opportunity)[0] as any).Full.View.sections).replace(/[a-zA-Z0-9]{18}/gm,"");
        // // const fieldsSO = JSON.stringify(Object.keys(result.records[recordId].fields)).replace(/[a-zA-Z0-9]{18}/gm,"");
        // // const layoutSO = JSON.stringify((Object.values(result.layouts.Opportunity)[0] as any).Full.View.sections).replace(/[a-zA-Z0-9]{18}/gm,"");
        
        // // // await writeFile('./fieldsINT.json', fieldsINT);
        // // // await writeFile('./layoutINT.json', layoutINT);
        // // await writeFile('./fieldsSO.json', fieldsSO);
        // // await writeFile('./layoutSO.json', layoutSO);

        // const fieldsINT =  JSON.parse((await readFile('./fieldsINT.json')).toString());
        // const layoutINT = JSON.parse((await readFile('./layoutINT.json')).toString());
        // const fieldsSO = JSON.parse((await readFile('./fieldsSO.json')).toString());
        // const layoutSO = JSON.parse((await readFile('./layoutSO.json')).toString());
        // // const fieldsINT = await readFile('./fieldsINT.json');
        // // const layoutINT = await readFile('./layoutINT.json');
        // // const fieldsSO = await readFile('./fieldsSO.json');
        // // const layoutSO = await readFile('./layoutSO.json');

        // expect(fieldsINT).toStrictEqual(fieldsSO);
        // expect(layoutINT).toStrictEqual(layoutSO);
    })
});