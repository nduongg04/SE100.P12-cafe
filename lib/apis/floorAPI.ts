import { authenticatedFetch } from "../auth";
import { getAllFloor, addFloor, deleteFloor } from "../actions/table.action";
interface FloorClientInterface {
  getAll(): Promise<Floor[] | null>;
  add(floorNumber:number): Promise<any>;
  delete(floorID:number): Promise<any>;
}
class FloorFacade {
  static async getAll() {
    return await getAllFloor();
  }
  static async add(floor:Omit<Floor, "floorID" | "tables">) {
    return await addFloor(floor);
  }
  static async delete(floorID:number) {
    return await deleteFloor(floorID);
  }
}
export class FloorApiAdapter implements FloorClientInterface {
  private floorFacade: typeof FloorFacade;
  constructor() {
    this.floorFacade = FloorFacade;
  }
  async getAll(): Promise<Floor[] | null> {
    const floors = await this.floorFacade.getAll();
    if (!floors) {
      return null;
    }
    return floors.map((floor:any) => ({
      floorID: floor.floorID,
      floorNumber: floor.floorNumber,
      tables: floor.tables,
    }));
  }
  async add(floorNumber:number): Promise<any> {
    return await this.floorFacade.add({floorNumber});
  }
  async delete(floorID:number): Promise<any> {
    return await this.floorFacade.delete(floorID);
  }
}
