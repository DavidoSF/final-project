export interface ActivityLogModel {
  id: string;
  actionType: string;
  description: string;
  performedByUserId: string | null;
  performedByUserName: string;
  timestamp: string;
}
