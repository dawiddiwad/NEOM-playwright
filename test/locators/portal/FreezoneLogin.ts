export class FreezoneLogin {
    public static readonly USERNAME: string = "//*[@id='sfdc_username_container']//input";
    public static readonly PASSWORD: string = "//*[@id='sfdc_password_container']//input";
    public static readonly LOGIN_BUTTON: string = "//button[descendant::*[text()='Log in']]";
    public static readonly USERNAME_BOX: string = "//p[contains(text(),'login using username')]";

    public static registeredUsernameFrom(source: string): string {
        const usernamePattern = /\S+.@.+\S/gm;
        const matches = source.match(usernamePattern)??[];
        if (!matches.length){
            throw new Error(`no matches for pattern: ${usernamePattern} in source:\n${source}`);
        }
        return matches[0];
    }
}