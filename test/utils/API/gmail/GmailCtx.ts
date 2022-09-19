import { google } from "googleapis";
import { gmail_v1 } from "googleapis";
import { GmailCredentialsHandler } from "../../common/credentials/GmailCredentialsHandler";

export class MissingGmailMessageError extends Error {
    constructor(msg: string){
        super(msg);
    }
}
export class GmailCtx {
    private gmail: gmail_v1.Gmail = google.gmail({ version: 'v1', auth: "placeholder"});
    private readonly context: string = 'me';

    public readonly Ready: Promise<this>;

    constructor(){
        this.Ready = new Promise(async makeReady => {
            const secret = (await new GmailCredentialsHandler().Ready).credentials();
            const oAuth2Client = new google.auth.OAuth2(
                    secret.credentials.installed.client_id, 
                    secret.credentials.installed.client_secret,
                    secret.credentials.installed.redirect_uris[0]);
                    oAuth2Client.setCredentials(secret.token);
            this.gmail = google.gmail({ version: 'v1', auth: oAuth2Client});
            makeReady(this);
        })
    }

    private async markMessageRead(id: string): Promise<void>{
        await this.gmail.users.messages.modify({
            id: id,
            userId: this.context,
            requestBody: {
                removeLabelIds: ['UNREAD']
            }
        })
    }

    private async readMessageById(id: string): Promise<gmail_v1.Schema$Message> {
        return (await this.gmail.users.messages.get({
            id: id,
            userId: this.context,
        }))?.data as gmail_v1.Schema$Message
    }

    private async latestMessageByQuery(query: string): Promise<gmail_v1.Schema$Message> {
        const message = ((await this.gmail.users.messages.list({
            q: query,
            userId: this.context,
        }))?.data.messages??[])[0];
        if (!message) {
            throw new MissingGmailMessageError(`missing messages for query: ${query}`);
        }
        return message;
    }

    private async readLatestByQuery(query: string): Promise<string> {
        let message = await (await this.latestMessageByQuery(query));
        if (!message.id){
            throw new Error(`missing message id for message:\n${message}`);
        }
        message = await this.readMessageById(message.id);
        if (!message.id || !message.snippet){
            throw new Error(`missing message id or snippet for message:\n${message}`);
        }
        await this.markMessageRead(message.id);
        return message.snippet;
    }

    public async latestFreezoneSignupLinkMsg(): Promise<string> {
        return this.readLatestByQuery("label:dmcc-signup-link label:unread");
    }

    public async latestFreezoneSignupCodeMsg(): Promise<string> {
        return this.readLatestByQuery("label:dmcc-signup-code label:unread");
    }
}