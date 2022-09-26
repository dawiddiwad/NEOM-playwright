import { faker } from "@faker-js/faker";
import test from "@playwright/test";
import { QueryResult, SuccessResult as RecordResult } from "jsforce";
import { Case } from "../neom/lp/layouts/Case";
import { Contract } from "../neom/lp/layouts/Contract";
import { Opportunity } from "../neom/lp/layouts/Opportunity";
import { SfdcApiCtx } from "../utils/API/sfdc/SfdcApiCtx";
import { UiApi } from "../utils/API/sfdc/UiApi";
import { Environment } from "../utils/common/credentials/structures/Environment";
import { User } from "../utils/common/credentials/structures/User";

test.describe.parallel('SFDC LP Layouts validation demo via UI-API for LP Leasing Team', async () => {
    let sysadminApiCtx: SfdcApiCtx;
    let leasingTeamApiCtx: SfdcApiCtx;

    test.beforeAll(async () => {
        sysadminApiCtx = await new SfdcApiCtx(Environment.INT, User.SYSADMIN).Ready;
        leasingTeamApiCtx = await new SfdcApiCtx(Environment.INT, User.LP_LEASING).Ready;
    });

    test('LP Opportunity full view Layout', async() => {
        let oppId;
        await test.step('create Opportunity record', async () => {
            const oppRecordTypeId = (await sysadminApiCtx.query("select id from recordtype where name = 'LP - Application'") as QueryResult<any>).records[0].Id;
            const oppData = {
                RecordTypeId: oppRecordTypeId,
                Name: "test-automation-via-api",
                StageName: "New",
                CloseDate: "2030-10-07"
            }
            oppId = (await leasingTeamApiCtx.create("Opportunity", oppData) as RecordResult).id;
        });

        await test.step('Validate Layout', async () => {
            await UiApi.compareLocalLayoutSectionsWithOrg(Opportunity.VIEW_FULL_SECTIONS, oppId, leasingTeamApiCtx);
        });
    });

    test('LP Contract full view Layout', async() => {
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

    test('LP Case full view Layout', async () => {
        let caseId;
        await test.step('create Case record', async () => {
            const caseRecordId = (await sysadminApiCtx.query("select id from recordtype where name = 'LP Case'") as QueryResult<any>).records[0].Id;
            const caseData = {
                Status: "New",
                Origin: "Email",
                RecordTypeId: caseRecordId
            }
            caseId = (await leasingTeamApiCtx.create("Case", caseData) as RecordResult).id;
        })

        await test.step('Validate Layout', async () => {
            await UiApi.compareLocalLayoutSectionsWithOrg(Case.VIEW_FULL_SECTIONS, caseId, leasingTeamApiCtx);
        })
    });

    // test.skip('grab data', async() => {
    //     await UiApi.writeLayoutSectionsToFileFromOrg(
    //         './sections.json', 
    //         '5003H0000072r6oQAA', leasingTeamApiCtx);
    // })
})