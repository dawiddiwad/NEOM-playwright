import { Page } from "@playwright/test";

export class Opportunity {
    public static readonly LEAD_EMAIL: string = "//input[@name='Lead_Email__c']";
    public static readonly NEED_ANALYSIS_STAGE: string = "(//*[text()='Needs Analysis'])[1]";
    public static readonly SAVE_BUTTON: string = "//button[@name='SaveEdit']";
    public static readonly MARK_AS_CURRENT_STAGE_BUTTON: string = "//*[text()='Mark as Current Stage']";

    public static async selectItemOnLookup(page: Page, lookupLabel: string, lookupItem: string): Promise<void> {
        await page.fill(`//input[ancestor::div[preceding-sibling::label[text()='${lookupLabel}']]]`, lookupItem);
        await page.click(`//input[ancestor::div[preceding-sibling::label[text()='${lookupLabel}']]]`);
        await page.click(`//lightning-base-combobox-formatted-text[@title='${lookupItem}']`);
    }
}