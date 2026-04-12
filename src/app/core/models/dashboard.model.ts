export interface DashboardOverviewModel {
  totalClients: number;
  totalServices: number;
  pendingAppointments: number;
  approvedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalRevenue: number;
}

export interface ServiceStatisticsModel {
  serviceId: string;
  serviceName: string;
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
}
