export type AppointmentStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'Cancelled';

export interface AppointmentModel {
  id: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  assignedStaffId: string | null;
  assignedStaffName: string;
  scheduledDate: string;
  status: AppointmentStatus;
  notes: string;
  priceAtBooking: number;
  createdAt: string;
}
