import { GmailCtx, MissingGmailMessageError } from "./GmailCtx";

export class FreezoneMailer extends GmailCtx {
    constructor(){
        super();
    }

    private parse(source: string, pattern: RegExp): string {
        const matches = source.match(pattern)??[];
        if (!matches.length){
            throw new Error(`no matches for pattern: ${pattern} in source:\n${source}`);
        }
        return matches[0];
    }

    private parseSignupCode(source: string) {
        return this.parse(source, /[0-9]{6}/);
    }

    private parseSignupLink(source: string): string {
        return this.parse(source, /https\S+/);
    }

    public async latestSignupCode(): Promise<string> {
        try {
            return this.parseSignupCode(
                await this.latestFreezoneSignupCodeMsg());
        } catch (error) {
            if (error instanceof MissingGmailMessageError){
                console.log("no OTP messages yet...");
                return this.latestSignupCode();
            } else {
                console.error(`unable to get signup code due to:\n${(error as Error).stack}`);
                process.exit(1);
            }
        }
    }

    public async latestSignupLink(): Promise<string> {
        try {
            return this.parseSignupLink(
                await this.latestFreezoneSignupLinkMsg());
        } catch (error) {
            if (error instanceof MissingGmailMessageError){
                console.log("no signup link messages yet...");
                return this.latestSignupLink();
            } else {
                console.error(`unable to get signup link due to:\n${(error as Error).stack}`);
                process.exit(1);
            }
        }
    }
}