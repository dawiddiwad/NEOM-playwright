import { faker } from "@faker-js/faker";
import { Page } from "@playwright/test";
import { SuccessResult } from "jsforce";
import { SfdcApiCtx } from "../../../utils/API/sfdc/SfdcApiCtx";
import { SfdcUiCtx } from "../../../utils/UI/SfdcUiCtx";
import { ListView } from "../ListView";
import { Modal } from "../Modal";
import { NavigationBar } from "../NavigationBar";

export class Lead {
    public static readonly FIRST_NAME: string = "//input[@name='firstName']";
    public static readonly LAST_NAME: string = "//input[@name='lastName']";
    public static readonly EMAIL: string = "//input[@name='Email']";
    public static readonly COMPANY: string = "//input[@name='Company']";
    public static readonly COUNTRY_CODE: string = "//input[@name='Country_code__c']";
    public static readonly AREA_CODE: string = "//input[@name='Area_code__c']";
    public static readonly PHONE_NUMBER: string = "//input[@name='Phone_No__c']";
    public static readonly DESCRIPTION: string = "(//textarea[ancestor::div[preceding-sibling::label[text()='Description']]])[1]";

    public static readonly SAVE_BUTTON: string = "//button[@name='SaveEdit']";

    public static async newByApi(api: SfdcApiCtx, data?: any): Promise<string> {
        if (!data) {
            data = {
                "LastName": faker.name.lastName(),
                "FirstName": faker.name.firstName(),
                "RecordTypeId": "012b0000000b1GuAAI",
                "Company": faker.company.companyName(),
                "Street": faker.address.streetName(),
                "City": faker.address.cityName(),
                "State": faker.address.state(),
                "PostalCode": faker.address.zipCode(),
                "Country": faker.address.country(),
                "Phone": "+7274114-920-272",
                "Email": "dmccinboxqa@gmail.com",
                "Description": "QA automation",
                "LeadSource": "Web",
                "CurrencyIsoCode": "AED",
                "About_DMCC_L1__c": "Advertising / News / Editorial",
                "About_DMCC_L2__c": "Email Advertising",
                "Company_Setup__c": "Immediately",
                "Company_Type__c": "New Company",
                "Country__c": "Afghanistan",
                "Phone_No__c": faker.phone.phoneNumber('###-###-###'),
                "Address_Country__c": "Afghanistan"
            };
        }
        return (await api.create('Lead', data) as SuccessResult).id;
    }

    public static async newByUi(page: Page): Promise<void> {
        await page.click(NavigationBar.APP_LAUNCHER);
        await page.fill(NavigationBar.APP_LAUNCHER_SEARCH_FIELD, "Leads");
        await page.click(NavigationBar.getAppLauncherSearchResultsItemByLabel("Leads"));
        await page.click(ListView.NEW_BUTTON);
        await page.click(Modal.NEXT_BUTTON);
        await Lead.fillPicklistWithValue(page, "Lead Source", "Web");
        await Lead.fillPicklistWithValue(page, "Origin Country", "Afghanistan");
        await Lead.fillPicklistWithValue(page, "Company Type", "New Company");
        await Lead.fillPicklistWithValue(page, "Activity Type", "Service");
        await Lead.fillPicklistWithValue(page, "Company Setup", "Immediately");
        await Lead.fillPicklistWithValue(page, "How did you hear about us (1)", "Advertising / News / Editorial");
        await Lead.fillPicklistWithValue(page, "How did you hear about us (2)", "Email Advertising");
        await Lead.fillPicklistWithValue(page, "Address Country", "Afghanistan");
        await page.fill(Lead.FIRST_NAME, faker.name.firstName());
        await page.fill(Lead.LAST_NAME, faker.name.lastName());
        await page.fill(Lead.EMAIL, "dmccinboxqa@gmail.com");
        await page.fill(Lead.COMPANY, faker.company.companyName());
        await page.fill(Lead.COUNTRY_CODE, faker.datatype.number(100).toString());
        await page.fill(Lead.AREA_CODE, faker.datatype.number(100).toString());
        await page.fill(Lead.PHONE_NUMBER, faker.phone.phoneNumber('###-###-###'));
        await page.fill(Lead.DESCRIPTION, "QA automation");
        await page.click(Lead.SAVE_BUTTON);
    }

    public static async fillPicklistWithValue(page: Page, picklistLabel: string, picklistValue: string): Promise<void> {
        await page.click(`(//button[ancestor::div[preceding-sibling::label[text()='${picklistLabel}']]])[1]`);
        await page.click(`(//lightning-base-combobox-item[@data-value='${picklistValue}'])[last()]`);
    }
}