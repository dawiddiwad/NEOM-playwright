import { SalesforceCredentialsHandler } from "../common/credentials/SalesforceCredentialsHandler";

(async() => {
    const username: string = process.argv[2];
    const password: string = process.argv[3];
    if (!username || !password){
        throw new Error(`missing username or password arguments, this was received:
            username: ${username}
            password: ${password}`);
    }
    await new SalesforceCredentialsHandler().Ready
        .then(async handle => {
            await handle.updateUserCredentialsFor({username, password});
    });
})();