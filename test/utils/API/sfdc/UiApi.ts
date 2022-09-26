import { expect } from "@playwright/test";
import { SfdcApiCtx } from "./SfdcApiCtx";
import { writeFile } from "fs/promises"

export class UiApi {
    private static layoutCompare(layout1: object, layout2: object): void {
        try {
            expect(layout1).toStrictEqual(layout2);
        } catch (error) {
            throw new Error(`Layouts do not match due to:\n${(error as Error).stack}`);
        }
    }

    private static parseLayoutSectionsFromLayoutData(layoutData: any): object{
        const sfdcId = /[a-zA-Z0-9]{18}/gm;
        return JSON.parse(JSON.stringify(layoutData.Full.View.sections).replace(sfdcId, ""));
    }

    public static async readLayoutFromOrg(recordId: string, apiCtx: SfdcApiCtx): Promise<object> {
        try {
            const layoutData = Object.values((await apiCtx.readRecordUi(recordId) as any).layouts)[0];
            return Object.values(layoutData)[0];
        } catch (error) {
            throw new Error(`Unable to read Layout data from org due to:\n${(error as Error).stack}`)
        }
    }

    public static async writeLayoutSectionsToFileFromOrg(filePath: string, recordId: string, apiCtx: SfdcApiCtx): Promise<void> {
        try {
            let layoutData: any = await UiApi.readLayoutFromOrg(recordId, apiCtx);
            layoutData = UiApi.parseLayoutSectionsFromLayoutData(layoutData);
            await writeFile(filePath, JSON.stringify(layoutData));
        } catch (error) {
            throw new Error(`Unable to write Layout data to file due to:\n${(error as Error).stack}`);
        }
    }

    public static async compareLocalLayoutSectionsWithOrg(localLayout: object, recordId: string, apiCtx: SfdcApiCtx): Promise<void>{
        try {
            let orgLayout: any = await UiApi.readLayoutFromOrg(recordId, apiCtx);
            orgLayout = UiApi.parseLayoutSectionsFromLayoutData(orgLayout);
            UiApi.layoutCompare(orgLayout, localLayout);
        } catch (error) {
            throw new Error(`Layouts validation via UI-API failed for user ${apiCtx.user} ${apiCtx.userInfo.id} due to:\n${(error as Error).stack}`);
        }
    }
}