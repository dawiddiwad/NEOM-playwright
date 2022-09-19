import { Page } from "@playwright/test";

export class StagesPath {
    public static readonly CHANGE_CLOSED_STAGE_BUTTON: string = "//button[descendant::span[text()='Change Closed Stage']]";
    public static readonly DONE_BUTTON: string = "//button[text()='Done']";

    public static async fillPicklistWithValue(page: Page, picklistLabel: string, picklistValue: string): Promise<void> {
        await page.click(`//button[@name='${picklistLabel}']`);
        await page.click(`//lightning-base-combobox-item[descendant::span[text()='${picklistValue}']]`);
    }
}