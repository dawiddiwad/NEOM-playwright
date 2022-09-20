import { Page } from "@playwright/test";
export class NavigationBar {
    public static readonly APP_LAUNCHER: string = "//button[descendant::*[contains(text(), 'App Launcher')]]";
    public static readonly APP_LAUNCHER_SEARCH_FIELD: string = "//input[contains(@type, 'search') and ancestor::one-app-launcher-menu]";

    private static getAppLauncherSearchResultsItemByLabel(label: string): string {
        return `//one-app-launcher-menu-item[descendant::*[@*='${label}']]`;
    }

    public static async openApp(page: Page, name: string): Promise<void>{
        await page.click(NavigationBar.APP_LAUNCHER);
        await page.fill(NavigationBar.APP_LAUNCHER_SEARCH_FIELD, name);
        await page.click(NavigationBar.getAppLauncherSearchResultsItemByLabel(name));
    }
}