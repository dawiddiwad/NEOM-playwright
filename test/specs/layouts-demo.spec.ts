import test from "@playwright/test";
import { QueryResult, SuccessResult } from "jsforce";
import { SfdcApiCtx } from "../utils/API/sfdc/SfdcApiCtx";
import { UiApi } from "../utils/API/sfdc/UiApi";
import { Environment } from "../utils/common/credentials/structures/Environment";
import { User } from "../utils/common/credentials/structures/User";

test.describe.serial('SFDC API Layouts validation demo', async () => {
    let sysadminApiCtx: SfdcApiCtx;
    let leasingTeamApiCtx: SfdcApiCtx;

    test.beforeAll(async () => {
        sysadminApiCtx = await new SfdcApiCtx(Environment.INT, User.SYSADMIN).Ready;
        leasingTeamApiCtx = await new SfdcApiCtx(Environment.INT, User.LP_LEASING).Ready;
    });

    test('Validate LP Opportunity Layout for LP Leasing Team', async() => {
        let oppId;
        await test.step('create Opportunity record', async () => {
            const oppRecordTypeId = (await sysadminApiCtx.query("select id from recordtype where name = 'LP - Application'") as QueryResult<any>).records[0].Id;
            const oppData = {
                RecordTypeId: oppRecordTypeId,
                Name: "test-api",
                StageName: "New",
                CloseDate: "2030-10-07"
            }
            oppId = (await sysadminApiCtx.create("Opportunity", oppData) as SuccessResult).id;
        });

        await test.step('Validate Layout', async () => {
            await UiApi.compareLocalLayoutSectionsWithOrg('./layoutSO.json', oppId, leasingTeamApiCtx);
        });
    });

    test('grab data', async() => {
        await UiApi.writeLayoutSectionsToFileFromOrg(
            './test/config/lp/layouts/case/full/sections.json', 
            '5003H0000071zFpQAI', leasingTeamApiCtx);
    })

    test('debug', async() => {
        console.log(await leasingTeamApiCtx.readRelatedListsUi('Opportunity', '0123H000000A6u9QAC'));
    });
})