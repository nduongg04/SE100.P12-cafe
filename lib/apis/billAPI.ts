
import { getAllBills, updateBillStatus } from "../actions/bill.action";

interface BillClientInterface {
  getAll(): Promise<Bill[]>;
  updateStatus(billId: number, status: string): Promise<any>;
}
class BillFacade {
  static async getAll() {
    return await getAllBills();
  }
  static async updateStatus(billId: number, status: string) {
    return await updateBillStatus(billId, status);
  }
}

export class BillApiAdapter implements BillClientInterface {
  private billFacade: typeof BillFacade;
  constructor() {
    this.billFacade = BillFacade;
  }
  async getAll(): Promise<Bill[]> {
    const response = await this.billFacade.getAll();
    console.log("response: ", response);
    const parseDate = (dateString: string): Date => {
            const [day, month, year] = dateString.split('/').map(Number);
            return new Date(year, month - 1, day);
        };
        if(!response) return [] as Bill[];
        const fetchedBills = response.map((item: any) => ({
            id: item.billId,
            customer: item.customer ? item.customer.customerName : "Visiting Customer",
            voucherValue: item.voucherValue,
            voucherTypeIndex: item.voucherTypeIndex,
            staff: item.staff ? item.staff.staffName : "Unknown Staff",
            payType: item.payType ? item.payType.payTypeName : "Unknown Pay Type",
            status: item.status,
            totalPrice: item.totalPrice,
            createdAt: item.createdAt,
            dateString: item.createdAt,
            billInfo: item.billDetailDTOs.map((info: any) => ({
                productName: info.productName,
                productCount: info.productCount,
                totalPriceDtail: info.totalPriceDtail,
                productPrice: info.productPrice,
            })),
        })) as Bill[];
        return fetchedBills.reverse();
  }
  async updateStatus(billId: number, status: string): Promise<any> {
    return await this.billFacade.updateStatus(billId, status);
  }
}


