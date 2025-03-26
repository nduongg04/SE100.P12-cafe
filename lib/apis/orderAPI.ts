import { getCategoryData, getAllVoucher, getProductData, getCustomerData, searchVoucherByCode, updateTableStatus, unBookedTable, updateProductSoldOut, addBooking, getBillBooking } from "@/app/employee/(order)/fetchingData";

export class OrderFacade {
    static async getCategory() {
        return await getCategoryData();
    }
    static async getAllVoucher() {
        return await getAllVoucher();
    }
    static async getProductData() {
        return await getProductData();
    }
    static async getCustomerData() {
        return await getCustomerData();
    }
    static async searchVoucherByCode(voucherCode:string) {
        return await searchVoucherByCode(voucherCode);
    }
    static async updateTableStatus(tableId:number,status:string) {
        return await updateTableStatus(tableId,status);
    }
    static async unBookedTable(tableId:number) {
        return await unBookedTable(tableId);
    }
    static async updateProductSoldOut(productId:number,isSoldOut:boolean) {
        return await updateProductSoldOut(productId,isSoldOut);
    }
    static async addBooking(billId:number,tableId:number) {
        return await addBooking(billId,tableId);
    }
    static async getBillBooking(tableId:number) {
        return await getBillBooking(tableId);
    }
}


