import { readFile, writeFile } from "fs/promises";
import Ajv from "ajv";
import console from "console";

export abstract class CredentialsHandler {
    protected content: any;
    protected schema: any;
    public readonly Ready: Promise<this>;
    public readonly path: string;
    
    constructor(filePath: string, schema: Object){
        this.path = filePath;
        this.schema = schema;
        this.Ready = new Promise(async (makeReady) => {
            try {
                this.content = await this.read();
                this.validate(this.content);
                makeReady(this); 
            } catch (e) {
                console.error(`unable to initilazie CredentialsHandler due to:\n${(e as Error).stack}`);
                process.exit(1);
            }
        })
    }

    protected validate(data: string){
        if (!this.schema){
            throw new Error('JSON Schema is not set for instance');
        }

        const validate = new Ajv()
            .compile(this.schema);

        const valid = validate(data);
        if (!valid){
            throw new Error(`JSON schema validation errors:\n${JSON.stringify(validate.errors)}`);
        }
    }

    protected async write(): Promise<void> {
        try{
            return await writeFile(this.path, JSON.stringify(this.content, null, 3)); 
        } catch(e) {
            throw new Error(`unable to write ${this.path} credentials file due to:\n${(e as Error).stack}`);
        }
    }

    protected async read(): Promise<string> {
        try {
            return JSON.parse((await readFile(this.path)).toString());
        } catch (e) {
            throw new Error(`unable to read ${this.path} credentials file due to:\n${(e as Error).stack}`);
        }
    }
}