export type WebrookMovidesk = {
  Id: number;
  Subject: string;
  Status: string;
  Justification: string;
  Actions: [
    {
      Id: number;
      Description: string;
      HtmlDescription: string;
      CreatedBy: {
        Id: string;
        PersonType: number;
        ProfileType: number;
        BusinessName: string;
        Email: string;
        Phone: string;
      };
      Attachments: [
        {
          FileName: string;
          Path: string;
          CreatedBy: {
            Id: string;
            PersonType: number;
            ProfileType: number;
            BusinessName: string;
            Email: string;
            Phone: string;
          };
          CreatedDate: Date;
        }
      ];
    }
  ];
  WebhookEvents: [
    {
      Criteria: number;
      Operator: number;
    }
  ];
  Urgency: string;
  ServiceFirstLevel: string;
  CustomFieldValues: [
    {
      CustomFieldId: number;
      CustomFieldRuleId: number;
      Line: number;
      Value: string;
      Items: [
        {
          PersonId: string,
          ClientId: string,
          Team: string,
          CustomFieldItem: string,
          StorageFileGuid: string,
          FileName: string
        }
      ];
    }
  ];
  SlaSolutionTime: number;
};
