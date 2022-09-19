import { Page } from "@playwright/test";

export class Opportunity {
    public static readonly LEAD_EMAIL: string = "//input[@name='Lead_Email__c']";
    public static readonly SAVE_BUTTON: string = "//button[@name='SaveEdit']";

    public static async selectItemOnLookup(page: Page, lookupLabel: string, lookupItem: string): Promise<void> {
        await page.fill(`//input[ancestor::div[preceding-sibling::label[text()='${lookupLabel}']]]`, lookupItem);
        await page.click(`//input[ancestor::div[preceding-sibling::label[text()='${lookupLabel}']]]`);
        await page.click(`//lightning-base-combobox-formatted-text[@title='${lookupItem}']`);
    }
}