import { CMUAccountType } from './CMUAccountType';

export class CMUAccountInfo {
  cmuitaccount_name: string;
  cmuitaccount: string;
  student_id: string;
  prename_id: string;
  prename_TH: string;
  prename_EN: string;
  firstname_TH: string;
  firstname_EN: string;
  lastname_TH: string;
  lastname_EN: string;
  organization_code: string;
  organization_name_TH: string;
  organization_name_EN: string;
  itaccounttype_id: CMUAccountType;
  itaccounttype_TH: string;
  itaccounttype_EN: string;
}
