declare type VoucherType =
  | "Percentage of bill"
  | "Discount directly on invoice";

declare type Voucher = {
  id: number;
  code: string;
  value: number;
  typeName: VoucherType;
  numberOfApplications: number;
  createdAt: Date;
  expiredAt: Date;
};

declare type VoucherApi = {
  voucherID: number;
  voucherCode: string;
  voucherValue: number;
  voucherType: {
    voucherTypeID: number;
    typeName: VoucherType;
  };
  maxApply: number;
  createdDate: string;
  expiredDate: string;
};

declare type Category = {
  categoryID: number;
  categoryName: string;
  icon: ForwardRefExoticComponent<any>;
};

declare type Dish = {
  productID: number;
  productName: string;
  price: number;
  image: string;
  isSoldOut: boolean;
  categoryName: string;
};
declare type Table = {
  tableID: number;
  tableNumber: number;
  tableTypeID: number;
  tableType: TableType;
  floorId: number;
  floor: Floor;
  billId: number;
  status: string;
}
declare type Floor = {
  floorID: number;
  floorNumber: number;
  tables: Table[] ;
}
declare type TableType = {
  tableTypeID: number;
  tableNameType: string;
}
declare type CustomerType = {
  customerTypeID: number;
  customerTypeName: string;
  discountValue: number;
  boundaryRevenue: number;
};
declare type Customer = {
  customerID: string
  customerName: string
  phoneNumber: string
  email: string
  revenue: number
  customerType: CustomerType | null
}
declare type Staff = {
  staffId: number;
  staffName: string;
  username: string;
  password: string;
  isAdmin: boolean;
}
declare type Bill = {
  id: number
  customer: string
  voucherValue: number
  voucherTypeIndex?: number
  staffId: string
  staff: string
  payType: string
  status: "Pending" | "Successful" 
  totalPrice: number
  createdAt: Date
  dateString: string
  billInfo: BillInfo[]
}
declare type BillInfo = {
  billID: number;
  productID: string;
  productName: string;
  productCount: number;
  totalPriceDtail: number;
  productPrice: number;
}

