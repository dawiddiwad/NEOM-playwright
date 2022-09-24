export class Opportunity {
    public static readonly VIEW_FULL_SECTIONS = [
        {
          "collapsible": true,
          "columns": 2,
          "heading": "Opportunity Information",
          "id": "",
          "layoutRows": [
            {
              "layoutItems": [
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Opportunity Name",
                  "layoutComponents": [
                    { "apiName": "Name", "componentType": "Field", "label": "Name" }
                  ],
                  "lookupIdApiName": "Id",
                  "required": true,
                  "sortable": false
                },
                {
                  "editableForNew": false,
                  "editableForUpdate": false,
                  "label": "Contract",
                  "layoutComponents": [
                    {
                      "apiName": "ContractId",
                      "componentType": "Field",
                      "label": "Contract ID"
                    }
                  ],
                  "lookupIdApiName": "ContractId",
                  "required": false,
                  "sortable": false
                }
              ]
            },
            {
              "layoutItems": [
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Account Name",
                  "layoutComponents": [
                    {
                      "apiName": "AccountId",
                      "componentType": "Field",
                      "label": "Account ID"
                    }
                  ],
                  "lookupIdApiName": "AccountId",
                  "required": true,
                  "sortable": false
                },
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Stage",
                  "layoutComponents": [
                    {
                      "apiName": "StageName",
                      "componentType": "Field",
                      "label": "Stage"
                    }
                  ],
                  "lookupIdApiName": null,
                  "required": true,
                  "sortable": false
                }
              ]
            },
            {
              "layoutItems": [
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Description",
                  "layoutComponents": [
                    {
                      "apiName": "Description",
                      "componentType": "Field",
                      "label": "Description"
                    }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                },
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Loss Reason",
                  "layoutComponents": [
                    {
                      "apiName": "Loss_Reason__c",
                      "componentType": "Field",
                      "label": "Loss Reason"
                    }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                }
              ]
            },
            {
              "layoutItems": [
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Next Step",
                  "layoutComponents": [
                    {
                      "apiName": "NextStep",
                      "componentType": "Field",
                      "label": "Next Step"
                    }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                },
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Close Date",
                  "layoutComponents": [
                    {
                      "apiName": "CloseDate",
                      "componentType": "Field",
                      "label": "Close Date"
                    }
                  ],
                  "lookupIdApiName": null,
                  "required": true,
                  "sortable": false
                }
              ]
            },
            {
              "layoutItems": [
                {
                  "editableForNew": false,
                  "editableForUpdate": false,
                  "label": "",
                  "layoutComponents": [
                    { "apiName": null, "componentType": "EmptySpace" }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                },
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Probability (%)",
                  "layoutComponents": [
                    {
                      "apiName": "Probability",
                      "componentType": "Field",
                      "label": "Probability (%)"
                    }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                }
              ]
            },
            {
              "layoutItems": [
                {
                  "editableForNew": false,
                  "editableForUpdate": false,
                  "label": "",
                  "layoutComponents": [
                    { "apiName": null, "componentType": "EmptySpace" }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                },
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Amount",
                  "layoutComponents": [
                    {
                      "apiName": "Amount",
                      "componentType": "Field",
                      "label": "Amount"
                    }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                }
              ]
            }
          ],
          "rows": 6,
          "useHeading": true
        },
        {
          "collapsible": true,
          "columns": 2,
          "heading": "Application Information",
          "id": "",
          "layoutRows": [
            {
              "layoutItems": [
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Application Status",
                  "layoutComponents": [
                    {
                      "apiName": "Application_Status__c",
                      "componentType": "Field",
                      "label": "Application Status"
                    }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                },
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Size of the Area (sqm)",
                  "layoutComponents": [
                    {
                      "apiName": "Size_of_Area_sqm__c",
                      "componentType": "Field",
                      "label": "Size of the Area (sqm)"
                    }
                  ],
                  "lookupIdApiName": null,
                  "required": true,
                  "sortable": false
                }
              ]
            },
            {
              "layoutItems": [
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Laydown Yard Assets",
                  "layoutComponents": [
                    {
                      "apiName": "Laydown_Yard_Assets__c",
                      "componentType": "Field",
                      "label": "Laydown Yard Assets"
                    }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                },
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Batch Plant Assets",
                  "layoutComponents": [
                    {
                      "apiName": "Batch_Plant_Assets__c",
                      "componentType": "Field",
                      "label": "Batch Plant Assets"
                    }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                }
              ]
            },
            {
              "layoutItems": [
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Other Laydown Yard Assets",
                  "layoutComponents": [
                    {
                      "apiName": "Other_Laydown_Yard_Assets__c",
                      "componentType": "Field",
                      "label": "Other Laydown Yard Assets"
                    }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                },
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Other Batch Plant Assets",
                  "layoutComponents": [
                    {
                      "apiName": "Other_Batch_Plant_Assets__c",
                      "componentType": "Field",
                      "label": "Other Batch Plant Assets"
                    }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                }
              ]
            },
            {
              "layoutItems": [
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Additional Information",
                  "layoutComponents": [
                    {
                      "apiName": "Additional_Information__c",
                      "componentType": "Field",
                      "label": "Additional Information"
                    }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                },
                {
                  "editableForNew": false,
                  "editableForUpdate": false,
                  "label": "",
                  "layoutComponents": [
                    { "apiName": null, "componentType": "EmptySpace" }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                }
              ]
            },
            {
              "layoutItems": [
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Submitted Date",
                  "layoutComponents": [
                    {
                      "apiName": "Submitted_Date__c",
                      "componentType": "Field",
                      "label": "Submitted Date"
                    }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                },
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Submitted By",
                  "layoutComponents": [
                    {
                      "apiName": "Submitted_By_user__c",
                      "componentType": "Field",
                      "label": "Submitted By"
                    }
                  ],
                  "lookupIdApiName": "Id",
                  "required": false,
                  "sortable": false
                }
              ]
            }
          ],
          "rows": 5,
          "useHeading": true
        },
        {
          "collapsible": true,
          "columns": 2,
          "heading": "Additional Information",
          "id": "",
          "layoutRows": [
            {
              "layoutItems": [
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Type of material",
                  "layoutComponents": [
                    {
                      "apiName": "Type_of_material__c",
                      "componentType": "Field",
                      "label": "Type of material"
                    }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                },
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Intended Utilities",
                  "layoutComponents": [
                    {
                      "apiName": "Intended_Utilities__c",
                      "componentType": "Field",
                      "label": "Intended Utilities"
                    }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                }
              ]
            },
            {
              "layoutItems": [
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Anticipated Waste Type",
                  "layoutComponents": [
                    {
                      "apiName": "Anticipated_Waste_Type__c",
                      "componentType": "Field",
                      "label": "Anticipated Waste Type"
                    }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                },
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Benefit to NEOM",
                  "layoutComponents": [
                    {
                      "apiName": "Benefit_to_NEOM__c",
                      "componentType": "Field",
                      "label": "Benefit to NEOM"
                    }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                }
              ]
            },
            {
              "layoutItems": [
                {
                  "editableForNew": true,
                  "editableForUpdate": true,
                  "label": "Willingness to provide Perform. Security",
                  "layoutComponents": [
                    {
                      "apiName": "Willingness_to_provide_Performance_Secur__c",
                      "componentType": "Field",
                      "label": "Willingness to provide Perform. Security"
                    }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                },
                {
                  "editableForNew": false,
                  "editableForUpdate": false,
                  "label": "",
                  "layoutComponents": [
                    { "apiName": null, "componentType": "EmptySpace" }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                }
              ]
            }
          ],
          "rows": 3,
          "useHeading": true
        },
        {
          "collapsible": true,
          "columns": 2,
          "heading": "System Information",
          "id": "",
          "layoutRows": [
            {
              "layoutItems": [
                {
                  "editableForNew": false,
                  "editableForUpdate": false,
                  "label": "Created By",
                  "layoutComponents": [
                    {
                      "apiName": "CreatedById",
                      "componentType": "Field",
                      "label": "Created By ID"
                    },
                    {
                      "apiName": "CreatedDate",
                      "componentType": "Field",
                      "label": "Created Date"
                    }
                  ],
                  "lookupIdApiName": "CreatedById",
                  "required": false,
                  "sortable": false
                },
                {
                  "editableForNew": false,
                  "editableForUpdate": false,
                  "label": "Last Modified By",
                  "layoutComponents": [
                    {
                      "apiName": "LastModifiedById",
                      "componentType": "Field",
                      "label": "Last Modified By ID"
                    },
                    {
                      "apiName": "LastModifiedDate",
                      "componentType": "Field",
                      "label": "Last Modified Date"
                    }
                  ],
                  "lookupIdApiName": "LastModifiedById",
                  "required": false,
                  "sortable": false
                }
              ]
            },
            {
              "layoutItems": [
                {
                  "editableForNew": false,
                  "editableForUpdate": false,
                  "label": "Opportunity Owner",
                  "layoutComponents": [
                    {
                      "apiName": "OwnerId",
                      "componentType": "Field",
                      "label": "Owner ID"
                    }
                  ],
                  "lookupIdApiName": "OwnerId",
                  "required": false,
                  "sortable": false
                },
                {
                  "editableForNew": false,
                  "editableForUpdate": false,
                  "label": "",
                  "layoutComponents": [
                    { "apiName": null, "componentType": "EmptySpace" }
                  ],
                  "lookupIdApiName": null,
                  "required": false,
                  "sortable": false
                }
              ]
            }
          ],
          "rows": 2,
          "useHeading": true
        }
      ];
}