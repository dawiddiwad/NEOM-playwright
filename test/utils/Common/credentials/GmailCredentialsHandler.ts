import { CredentialsHandler } from "./CredentialsHandler";
import { GmailCredentailsStructure, schema as gmailCredentialsSchema } from "./structures/GmailCredentialsStructure";

export class GmailCredentialsHandler extends CredentialsHandler {
    constructor(){
        super("./test/config/GmailCredentials.json", gmailCredentialsSchema);
    }

    public async updateUsing(credentials: string): Promise<void> {
        try {
            credentials = JSON.parse(credentials);
            this.validate(credentials);
            this.content =  <unknown> credentials as GmailCredentailsStructure;
            return this.write()
        } catch (e){
            console.error(`unable to update gmail credentials due to:\n${(e as Error).stack}`);
            process.exit(1);
        }
    }

    public credentials(): GmailCredentailsStructure {
        return this.content as GmailCredentailsStructure;
    }
}