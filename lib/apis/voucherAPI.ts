import { getAllVouchers, createVoucher, updateVoucher, deleteVouchers } from "../actions/voucher.action";
interface VoucherClientInterface {
  getAll(): Promise<Voucher[] | null>;
  create(voucher: {
    code: string;
    value: number;
    typeName: VoucherType;
    numberOfApplications: number;
    createdAt: Date;
    expiredAt: Date;
  }): Promise<Voucher | null>;
  update(voucher: Voucher): Promise<Voucher | null>;
  delete(ids: number[]): Promise<boolean>;
}
class VoucherFacade {
  static async getAll() {
    return await getAllVouchers();
  }
  static async create(voucher: Omit<Voucher, "id">) {
    return await createVoucher(voucher);
  }
  static async update(voucher: Voucher) {
    return await updateVoucher(voucher);
  }
  static async delete(ids: number[]) {
    return await deleteVouchers(ids);
  }
}
export class VoucherApiAdapter implements VoucherClientInterface {
  private voucherFacade: typeof VoucherFacade;
  constructor() {
    this.voucherFacade = VoucherFacade;
  }
  async getAll(): Promise<Voucher[] | null> {
    const vouchers = await this.voucherFacade.getAll();
    if (!vouchers) {
      return null;
    }
    console.log("vouchers", vouchers);
    return vouchers.map((voucher: any) => ({
      id: voucher.id,
      code: voucher.code,
      value: voucher.value,
      typeName: voucher.typeName,
      numberOfApplications: voucher.numberOfApplications,
      createdAt: voucher.createdAt,
      expiredAt: voucher.expiredAt,
    }));
  }
  async create(voucher: {
    code: string;
    value: number;
    typeName: VoucherType;
    numberOfApplications: number;
    createdAt: Date;
    expiredAt: Date;
  }): Promise<Voucher | null> {
    return await this.voucherFacade.create(voucher);
  }
  async update(voucher: Voucher): Promise<Voucher | null> {
    return await this.voucherFacade.update(voucher);
  }
  async delete(ids: number[]): Promise<boolean> {
    return await this.voucherFacade.delete(ids);
  }
}
