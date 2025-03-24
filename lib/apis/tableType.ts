import { getAllTableType } from "../actions/table.action";

interface TableTypeClientInterface {
  getAll(): Promise<TableType[]|null>;
}
class TableTypeFacade {
  static async getAll() {
    return await getAllTableType();
  }
}
export class TableTypeApiAdapter implements TableTypeClientInterface {
  private tableTypeFacade: typeof TableTypeFacade;
  constructor() {
    this.tableTypeFacade = TableTypeFacade;
  }
  async getAll(): Promise<TableType[] | null> {
    const tableTypes = await this.tableTypeFacade.getAll();
    if (!tableTypes) {
      return null;
    }
    return tableTypes.map((tableType:any) => ({
      tableTypeID: tableType.tableTypeID,
        tableNameType: tableType.tableNameType,
      }));
    
  }
}
