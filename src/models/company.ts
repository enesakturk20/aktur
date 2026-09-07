export interface SchoolItem {
  id: number;
  name: string;
  address?: string;
  [key: string]: any;
}

export interface VehicleItem {
  id: number;
  plate: string;
  driverName?: string;
  driverPhone?: string;
  capacity?: number;
  [key: string]: any;
}

export interface StudentItem {
  id: number;
  fullName: string;
  schoolId?: number;
  vehicleId?: number;
  [key: string]: any;
}
