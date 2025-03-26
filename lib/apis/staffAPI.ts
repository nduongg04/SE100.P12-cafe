import { getAllStaff, deleteStaff, addStaff } from "../actions/staff.action";

interface StaffClientInterface {
  getAllStaff(): Promise<Staff[] | null>;
  deleteStaff(staffId: string): Promise<any>;
  addStaff(staff: { staffName: string, username: string, isAdmin: boolean, password: string }): Promise<any>;
}
class StaffFacade {
  static async getAllStaff() {
    return await getAllStaff();
  }
  static async deleteStaff(staffId: string) {
    return await deleteStaff(staffId);
  }
  static async addStaff(staff: Omit<Staff, 'staffId'>) {
    return await addStaff(staff);
  }
}
export class StaffApiAdapter implements StaffClientInterface {
  private staffFacade: typeof StaffFacade;
  constructor() {
    this.staffFacade = StaffFacade;
  }
  async getAllStaff(): Promise<any> {
    const staff = await this.staffFacade.getAllStaff();
    if(!staff)
    {
      return null;
    }
    return staff.map((item: any) => ({
      staffId: item.staffId,
      staffName: item.staffName,
      username: item.username,
      isAdmin: item.isAdmin,
      password: item.password
    })) as Staff[];
  }
  async deleteStaff(staffId: string): Promise<any> {
    return await this.staffFacade.deleteStaff(staffId);
  }
  async addStaff(staff: { staffName: string, username: string, isAdmin: boolean, password: string }): Promise<any> {
    const response = await this.staffFacade.addStaff(staff);
    console.log("response: ", response);
    return response;
  }
}
