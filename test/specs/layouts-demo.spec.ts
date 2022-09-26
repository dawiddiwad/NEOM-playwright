import { faker } from "@faker-js/faker";
import test from "@playwright/test";
import { QueryResult, SuccessResult as RecordResult } from "jsforce";
import { Contract } from "../neom/lp/layouts/Contract";
import { Opportunity } from "../neom/lp/layouts/Opportunity";
import { SfdcApiCtx } from "../utils/API/sfdc/SfdcApiCtx";
import { UiApi } from "../utils/API/sfdc/UiApi";
import { Environment } from "../utils/common/credentials/structures/Environment";
import { User } from "../utils/common/credentials/structures/User";

test.describe.parallel('SFDC API Layouts validation demo', async () => {
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
            oppId = (await leasingTeamApiCtx.create("Opportunity", oppData) as RecordResult).id;
        });

        await test.step('Validate Layout', async () => {
            await UiApi.compareLocalLayoutSectionsWithOrg(Opportunity.VIEW_FULL_SECTIONS, oppId, leasingTeamApiCtx);
        });
    });

    test('Validate LP Contract Layout for LP Leasing Team', async() => {
        let conId;
        await test.step('create Contract record', async () => {
            const accData = {
                Name: faker.company.name()
            }
            const accId = (await leasingTeamApiCtx.create("Account", accData) as RecordResult).id;
            const conRecordTypeId = (await sysadminApiCtx.query("select id from recordtype where name = 'LP Contract'") as QueryResult<any>).records[0].Id;
            const conData = {
                RecordTypeId: conRecordTypeId,
                AccountId: accId,
                Status: 'Draft',
                StartDate: '2049-01-01'
            }
            conId = (await leasingTeamApiCtx.create("Contract", conData) as RecordResult).id;
        });

        await test.step('Validate Layout', async () => {
            await UiApi.compareLocalLayoutSectionsWithOrg(Contract.VIEW_FULL_SECTIONS, conId, leasingTeamApiCtx);
        });
    });

    test('grab data', async() => {
        await UiApi.writeLayoutSectionsToFileFromOrg(
            './test/config/lp/layouts/case/full/sections.json', 
            '5003H0000071zFpQAI', leasingTeamApiCtx);
    })

    test('debug', async() => {
        await leasingTeamApiCtx.readRelatedListsUi('Opportunity', '0123H000000A6u9QAC');
    });
})