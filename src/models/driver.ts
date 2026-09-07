export interface DriverPassenger {
  id: number;
  fullName: string;
  phone?: string;
  address?: string;
  school?: string;
  [key: string]: any;
}
