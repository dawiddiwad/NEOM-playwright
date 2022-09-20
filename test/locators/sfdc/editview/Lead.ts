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
                "RecordTypeId": "0123H000000A8wXQAS",
                "Company": faker.company.name(),
                "Phone": faker.phone.number('###-###-###'),
                "Email": faker.internet.email(),
                "Description": "QA automation",
                "LeadSource": "Other",
            };
        }
        return (await api.create('Lead', data) as SuccessResult).id;
    }

    public static async deleteByApi(api: SfdcApiCtx, id: string): Promise<string> {
        return (await api.delete('Lead', id) as SuccessResult).id;
    }

    public static async newByUi(page: Page): Promise<void> {
        await NavigationBar.openApp(page, "Leads");
        await page.click(ListView.NEW_BUTTON);
        await page.click(Modal.FOOD_LEAD_BUTTON);
        await page.click(Modal.NEXT_BUTTON);
        await Lead.fillPicklistWithValue(page, "Lead Source", "Other");
        await page.fill(Lead.FIRST_NAME, faker.name.firstName());
        await page.fill(Lead.LAST_NAME, faker.name.lastName());
        await page.fill(Lead.EMAIL, faker.internet.email());
        await page.fill(Lead.COMPANY, faker.company.name());
        await page.fill(Lead.DESCRIPTION, "QA automation");
        await page.click(Lead.SAVE_BUTTON);
    }

    public static async fillPicklistWithValue(page: Page, picklistLabel: string, picklistValue: string): Promise<void> {
        await page.click(`(//button[ancestor::div[preceding-sibling::label[text()='${picklistLabel}']]])[1]`);
        await page.click(`(//lightning-base-combobox-item[@data-value='${picklistValue}'])[last()]`);
    }
}