"use client";
import { deleteTable, getAllTable, updateTable } from "../actions/table.action";
import { addTable } from "../actions/table.action";
export class TableFacade {
  static async getAll() {
    return await getAllTable();
  }

  static async add(table: Omit<Table, "tableID" | "billId" | "status" | "tableType" | "floorId">) {
    return await addTable(table);
  }

  static async update(table: Table) {
    return await updateTable(table);
  }
  static async delete(tableID: number) {
    return await deleteTable(tableID);
  }
}
interface TableClientInterface {
  getAll(): Promise<Table[] | null>;
  add(table:{floor:Floor, tableTypeID:number, tableNumber:number}): Promise<any>;
  update(table: Table): Promise<any>;
  delete(tableId: number): Promise<void>;
}

export class TableApiAdapter implements TableClientInterface {
  private tableFacade: typeof TableFacade;
  constructor() {
    this.tableFacade = TableFacade;
  }
  async getAll(): Promise<Table[] | null> {
    const tables = await this.tableFacade.getAll();
    if (!tables) {
      return null;
    }
    return tables.map((table:any) => ({
      tableID: table.tableID,
      tableNumber: table.tableNumber,
      floorId: table.floor.floorID,
      tableTypeID: table.tableTypeID,
      status: table.status,
      billId: table.billId,
      floor: table.floor,
      tableType: table.tableType,
    }));
  }

  async add(table: { floor: { floorID: number; floorNumber: number; tables: Table[] }; tableTypeID: number; tableNumber: number }): Promise<any> {
    return await this.tableFacade.add(table);
  }

  async update(table: Table): Promise<any> {
    return await this.tableFacade.update(table);
  }

  async delete(tableId: number): Promise<any> {
    return await deleteTable(tableId);
  }
}
