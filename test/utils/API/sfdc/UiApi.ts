import { expect } from "@playwright/test";
import { SfdcApiCtx } from "./SfdcApiCtx";
import { readFile, writeFile } from "fs/promises"

export class UiApi {
    public static layoutCompare(layout1: object, layout2: object): void {
        try {
            expect(layout1).toStrictEqual(layout2);
        } catch (error) {
            throw new Error(`Layouts do not match due to:\n${(error as Error).stack}`)
        }
    }

    public static async parseDataFromFile(filePath: string): Promise<object> {
        try {
            return JSON.parse((await readFile(filePath)).toString());
        } catch (error) {
            throw new Error(`Unable to read Layout data from file due to:\n${(error as Error).stack}`)
        }
    }

    public static async readLayoutFromOrg(recordId: string, apiCtx: SfdcApiCtx): Promise<object> {
        try {
            const layoutData = Object.values((await apiCtx.readRecordUI(recordId) as any).layouts)[0];
            return Object.values(layoutData)[0];
        } catch (error) {
            throw new Error(`Unable to read Layout data from org due to:\n${(error as Error).stack}`)
        }
    }

    public static async wirteLayoutSectionsToFileFromOrg(filePath: string, recordId: string, apiCtx: SfdcApiCtx): Promise<void> {
        const sfdcId = /[a-zA-Z0-9]{18}/gm;
        try {
            let layoutData: any = await UiApi.readLayoutFromOrg(recordId, apiCtx);
            layoutData = JSON.stringify(
                layoutData.Full.View.sections).replace(sfdcId, "");
            await writeFile(filePath, layoutData);
        } catch (error) {
            throw new Error(`Unable to write Layout data to file due to:\n${(error as Error).stack}`);
        }
    }
}