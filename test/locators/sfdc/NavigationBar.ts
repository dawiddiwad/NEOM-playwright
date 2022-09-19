export class NavigationBar {
    public static readonly APP_LAUNCHER: string = "//button[descendant::*[contains(text(), 'App Launcher')]]";
    public static readonly APP_LAUNCHER_SEARCH_FIELD: string = "//input[contains(@type, 'search') and ancestor::one-app-launcher-menu]";

    public static getAppLauncherSearchResultsItemByLabel(label: string): string {
        return `//one-app-launcher-menu-item[descendant::*[@*='${label}']]`;
    }
}