import { Product } from "./menuOrder";
import { Category } from "./menuOrder";
import { getCookies } from "@/lib/action";
import { toast } from "sonner";
export type Customer = {
  customerId: string;
  customerType: CustomerType | null;
  customerName: string;
  phoneNumber: string;
  email: string;
  revenue: number;
};
export type CustomerType = {
  customerTypeId: string;
  customerTypeName: string;
  boundaryRevenue: number;
  discountValue: number;
};

export async function getCategoryData(): Promise<Category[]> {
    const cookies = await getCookies("refreshToken");
    const token = cookies?.value;
    const url = process.env.BASE_URL;
    try{
        const response = await fetch(`${url}/category/getall`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (!response.ok) {
            toast.error("Failed to fetch data: " + data.message);
            
        }
        const categories: Category[] = data.map((category: any) => ({
            CategoryID: category.categoryID,
            CategoryName: category.categoryName,
        }));
        return categories;
    }catch(e){
        toast.error("Failed to fetch data: " + e);
        return [];
    }
}

export async function getProductData(): Promise<Product[]> {
    const cookies = await getCookies("refreshToken");
    const token = cookies?.value;
    const url = process.env.BASE_URL;
    try{
        const response = await fetch(`${url}/product/getall`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (!response.ok) {
            toast.error("Failed to fetch data: " + data.message);
            
        }
        const products: Product[] = data.map((product: any) => ({
            ProductId: product.productID,
            ProductName: product.productName,
            Price: product.price,
            Image: product.image,
            IsSoldOut: product.isSoldOut,
            CategoryName: product.categoryName,
        }));
        return products;
    }catch(e){
        toast.error("Failed to fetch data: " + e);
        return [];
    }
}

export async function getCustomerData(): Promise<Customer[]> {
    const cookies = await getCookies("refreshToken");
    const token = cookies?.value;
    const url = process.env.BASE_URL;
    try{
        const response = await fetch(`${url}/customer/getall`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (!response.ok) {
            toast.error("Failed to fetch data: " + data.message);
            
        }
        const customers: Customer[] = data.map((customer: any) => ({
            customerId: customer.customerID,
            customerName: customer.customerName,
            email: customer.email,
            phoneNumber: customer.phoneNumber,
            revenue: customer.revenue,
            customerType: customer.customerType==null? "Visting customer" : customer.customerType,
        }));
        return customers;
    }catch(e){
        toast.error("Failed to fetch data: " + e);
        return [];
    }
}

export async function searchVoucherByCode(voucherCode:string): Promise<VoucherApi|null> {
    const cookies = await getCookies("refreshToken");
    const token = cookies?.value;
    const url = process.env.BASE_URL;
    try{
        const response = await fetch(`${url}/voucher/getbycode?code=${voucherCode}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (!response.ok) {
            toast.error("Failed to fetch data: " + data.message);
            return null;
        }
        const voucher:VoucherApi={
          voucherID:data.voucherID,
          voucherCode:data.voucherCode,
          voucherValue:data.voucherValue,
          voucherType:{
            voucherTypeID:data.voucherType.voucherTypeId,
            typeName:data.voucherType.typeName
          },
          maxApply:data.maxApply,
          createdDate:data.createdDate,
          expiredDate:data.expiredDate
        }
        return voucher;
    }catch(e){
        toast.error("Failed to fetch data: " + e);
        return null;
    }
}
export async function updateTableStatus(tableId:number,status:string): Promise<boolean> {
  const cookies = await getCookies("refreshToken");
  const token = cookies?.value;
  const url = process.env.BASE_URL;
  try {
    const response = await fetch(`${url}/table/updatestatus/${tableId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: status,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error("Failed to update table status: " + data.message);
      return false;
    }
    return true;
  } catch (e) {
    toast.error("Failed to update table status: " + e);
    return false;
  }
}
export async function unBookedTable(
  tableId: number,
): Promise<boolean> {
  const cookies = await getCookies("refreshToken");
  const token = cookies?.value;
  const url = process.env.BASE_URL;
  try {
    const response = await fetch(`${url}/table/endingTable/${tableId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },

    });
    const data = await response.json();
    if (!response.ok) {
      toast.error("Failed to unbooked table: " + data.message);
      return false;
    }
    return true;
  } catch (e) {
    toast.error("Failed to unbooked table: " + e);
    return false;
  }
}
export async function updateProductSoldOut(
  productId: number,
  isSoldOut: boolean,
): Promise<boolean> {
  const cookies = await getCookies("refreshToken");
  const token = cookies?.value;
  const url = process.env.BASE_URL;
  try {
    const response = await fetch(`${url}/product/updateSoldout/${productId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isSoldOut: isSoldOut,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error("Failed to update product sold out: " + data.message);
      return false;
    }
    return true;
  } catch (e) {
    toast.error("Failed to update product sold out: " + e);
    return false;
  }
}
