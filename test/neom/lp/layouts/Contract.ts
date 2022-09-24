export class Contract {
  public static readonly VIEW_FULL_SECTIONS = [
    {
      collapsible: true,
      columns: 2,
      heading: "Contract Information",
      id: "",
      layoutRows: [
        {
          layoutItems: [
            {
              editableForNew: false,
              editableForUpdate: false,
              label: "Contract Owner",
              layoutComponents: [
                {
                  apiName: "OwnerId",
                  componentType: "Field",
                  label: "Owner ID",
                },
              ],
              lookupIdApiName: "OwnerId",
              required: false,
              sortable: false,
            },
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Status",
              layoutComponents: [
                { apiName: "Status", componentType: "Field", label: "Status" },
              ],
              lookupIdApiName: null,
              required: true,
              sortable: false,
            },
          ],
        },
        {
          layoutItems: [
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Account Name",
              layoutComponents: [
                {
                  apiName: "AccountId",
                  componentType: "Field",
                  label: "Account ID",
                },
              ],
              lookupIdApiName: "AccountId",
              required: true,
              sortable: false,
            },
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Contract Start Date",
              layoutComponents: [
                {
                  apiName: "StartDate",
                  componentType: "Field",
                  label: "Contract Start Date",
                },
              ],
              lookupIdApiName: null,
              required: true,
              sortable: false,
            },
          ],
        },
        {
          layoutItems: [
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Guarantor",
              layoutComponents: [
                {
                  apiName: "Guarantor__c",
                  componentType: "Field",
                  label: "Guarantor",
                },
              ],
              lookupIdApiName: "Id",
              required: false,
              sortable: false,
            },
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Contract End Date",
              layoutComponents: [
                {
                  apiName: "EndDate",
                  componentType: "Field",
                  label: "Contract End Date",
                },
              ],
              lookupIdApiName: null,
              required: false,
              sortable: false,
            },
          ],
        },
        {
          layoutItems: [
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Guarator - Person",
              layoutComponents: [
                {
                  apiName: "Guarantor_Person__c",
                  componentType: "Field",
                  label: "Guarator - Person",
                },
              ],
              lookupIdApiName: "Id",
              required: false,
              sortable: false,
            },
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Contract Auto Renewal",
              layoutComponents: [
                {
                  apiName: "Contract_Renewal__c",
                  componentType: "Field",
                  label: "Contract Auto Renewal",
                },
              ],
              lookupIdApiName: null,
              required: false,
              sortable: false,
            },
          ],
        },
        {
          layoutItems: [
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Price Book",
              layoutComponents: [
                {
                  apiName: "Pricebook2Id",
                  componentType: "Field",
                  label: "Price Book ID",
                },
              ],
              lookupIdApiName: "Pricebook2Id",
              required: false,
              sortable: false,
            },
            {
              editableForNew: false,
              editableForUpdate: false,
              label: "",
              layoutComponents: [
                { apiName: null, componentType: "EmptySpace" },
              ],
              lookupIdApiName: null,
              required: false,
              sortable: false,
            },
          ],
        },
      ],
      rows: 5,
      useHeading: true,
    },
    {
      collapsible: true,
      columns: 2,
      heading: "Contract Data",
      id: "",
      layoutRows: [
        {
          layoutItems: [
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Plot Size - Number",
              layoutComponents: [
                {
                  apiName: "Plot_Size_Number__c",
                  componentType: "Field",
                  label: "Plot Size - Number",
                },
              ],
              lookupIdApiName: null,
              required: false,
              sortable: false,
            },
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Plot Size - Words",
              layoutComponents: [
                {
                  apiName: "Plot_Size_Words__c",
                  componentType: "Field",
                  label: "Plot Size - Words",
                },
              ],
              lookupIdApiName: null,
              required: false,
              sortable: false,
            },
          ],
        },
        {
          layoutItems: [
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Permitted Use",
              layoutComponents: [
                {
                  apiName: "Permitted_Use__c",
                  componentType: "Field",
                  label: "Permitted Use",
                },
              ],
              lookupIdApiName: null,
              required: false,
              sortable: false,
            },
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Bank Guarantee Amount",
              layoutComponents: [
                {
                  apiName: "Bank_Guarantee_Amount__c",
                  componentType: "Field",
                  label: "Bank Guarantee Amount",
                },
              ],
              lookupIdApiName: null,
              required: false,
              sortable: false,
            },
          ],
        },
        {
          layoutItems: [
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Commencement Date",
              layoutComponents: [
                {
                  apiName: "Commencement_Date__c",
                  componentType: "Field",
                  label: "Commencement Date",
                },
              ],
              lookupIdApiName: null,
              required: false,
              sortable: false,
            },
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Completion Date",
              layoutComponents: [
                {
                  apiName: "Completion_Date__c",
                  componentType: "Field",
                  label: "Completion Date",
                },
              ],
              lookupIdApiName: null,
              required: false,
              sortable: false,
            },
          ],
        },
      ],
      rows: 3,
      useHeading: true,
    },
    {
      collapsible: true,
      columns: 2,
      heading: "Schedule",
      id: "",
      layoutRows: [
        {
          layoutItems: [
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Plot Plan - Schedule 1",
              layoutComponents: [
                {
                  apiName: "Plot_Plan_Schedule_1__c",
                  componentType: "Field",
                  label: "Plot Plan - Schedule 1",
                },
              ],
              lookupIdApiName: null,
              required: false,
              sortable: false,
            },
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Use Fee - Schedule 2",
              layoutComponents: [
                {
                  apiName: "Use_Fee_Schedule_2__c",
                  componentType: "Field",
                  label: "Use Fee - Schedule 2",
                },
              ],
              lookupIdApiName: null,
              required: false,
              sortable: false,
            },
          ],
        },
        {
          layoutItems: [
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Scope of Work - Schedule 5",
              layoutComponents: [
                {
                  apiName: "Scope_of_Work_Schedule_5__c",
                  componentType: "Field",
                  label: "Scope of Work - Schedule 5",
                },
              ],
              lookupIdApiName: null,
              required: false,
              sortable: false,
            },
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Concept Drawing - Schedule 6",
              layoutComponents: [
                {
                  apiName: "Concept_Drawing_Schedule_6__c",
                  componentType: "Field",
                  label: "Concept Drawing - Schedule 6",
                },
              ],
              lookupIdApiName: null,
              required: false,
              sortable: false,
            },
          ],
        },
      ],
      rows: 2,
      useHeading: true,
    },
    {
      collapsible: true,
      columns: 2,
      heading: "Amendment and Special Conditions",
      id: "",
      layoutRows: [
        {
          layoutItems: [
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Amendment",
              layoutComponents: [
                {
                  apiName: "Amendment__c",
                  componentType: "Field",
                  label: "Amendment",
                },
              ],
              lookupIdApiName: null,
              required: false,
              sortable: false,
            },
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Special Condition",
              layoutComponents: [
                {
                  apiName: "Special_Condition__c",
                  componentType: "Field",
                  label: "Special Condition",
                },
              ],
              lookupIdApiName: null,
              required: false,
              sortable: false,
            },
          ],
        },
      ],
      rows: 1,
      useHeading: true,
    },
    {
      collapsible: true,
      columns: 2,
      heading: "Signature Information",
      id: "",
      layoutRows: [
        {
          layoutItems: [
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Customer Signed By",
              layoutComponents: [
                {
                  apiName: "CustomerSignedId",
                  componentType: "Field",
                  label: "Customer Signed By ID",
                },
              ],
              lookupIdApiName: "CustomerSignedId",
              required: false,
              sortable: false,
            },
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Company Signed By",
              layoutComponents: [
                {
                  apiName: "CompanySignedId",
                  componentType: "Field",
                  label: "Company Signed By ID",
                },
              ],
              lookupIdApiName: "CompanySignedId",
              required: false,
              sortable: false,
            },
          ],
        },
        {
          layoutItems: [
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Customer Signed Date",
              layoutComponents: [
                {
                  apiName: "",
                  componentType: "Field",
                  label: "Customer Signed Date",
                },
              ],
              lookupIdApiName: null,
              required: false,
              sortable: false,
            },
            {
              editableForNew: true,
              editableForUpdate: true,
              label: "Company Signed Date",
              layoutComponents: [
                {
                  apiName: "CompanySignedDate",
                  componentType: "Field",
                  label: "Company Signed Date",
                },
              ],
              lookupIdApiName: null,
              required: false,
              sortable: false,
            },
          ],
        },
      ],
      rows: 2,
      useHeading: true,
    },
    {
      collapsible: true,
      columns: 2,
      heading: "System Information",
      id: "",
      layoutRows: [
        {
          layoutItems: [
            {
              editableForNew: false,
              editableForUpdate: false,
              label: "Created By",
              layoutComponents: [
                {
                  apiName: "CreatedById",
                  componentType: "Field",
                  label: "Created By ID",
                },
                {
                  apiName: "CreatedDate",
                  componentType: "Field",
                  label: "Created Date",
                },
              ],
              lookupIdApiName: "CreatedById",
              required: false,
              sortable: false,
            },
            {
              editableForNew: false,
              editableForUpdate: false,
              label: "Last Modified By",
              layoutComponents: [
                {
                  apiName: "LastModifiedById",
                  componentType: "Field",
                  label: "Last Modified By ID",
                },
                {
                  apiName: "LastModifiedDate",
                  componentType: "Field",
                  label: "Last Modified Date",
                },
              ],
              lookupIdApiName: "LastModifiedById",
              required: false,
              sortable: false,
            },
          ],
        },
      ],
      rows: 1,
      useHeading: true,
    },
  ];
}
