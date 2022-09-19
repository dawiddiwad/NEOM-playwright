import { GmailCredentialsHandler } from "../common/credentials/GmailCredentialsHandler";

(async() => {
    const gmailCredentials: string = process.argv[2];
    if (!gmailCredentials){
        throw new Error(`missing gmail credential arguments`);
    }
    await new GmailCredentialsHandler().Ready
        .then(async handle => {
            await handle.updateUsing(gmailCredentials);
        })
})();