import { Bill, BillInfo } from "./columns";
import { getCookies } from "@/lib/action";
import { toast } from "sonner";
export async function getData(): Promise<Bill[]> {
    // const bills: Bill[] = Array.from({ length: 35 }, (_, i) => ({
    //     id: `${i + 1}`,
    //     customerId: `${i + 1}`,
    //     voucherId: `${i + 1}`,
    //     staffId: `${i + 1}`,
    //     payTypeId: `${i + 1}`,
    //     status: "Waiting",
    //     totalPrice: 10000 * (i + 1),
    //     createdAt: new Date(`2024-9-${(i % 30) + 1}`),
    //     billInfo:  Array.from({ length: 15 }, (_, j) => ({
    //         billID: `${i + 1}`,
    //         productID: `${j + 1}`,
    //         productName: `Product ${j + 1}`,
    //         productCount: j + 1,
    //         totalPrice: 1000 * (j + 1),
    //         productPrice: 1000 * (j + 1),
    //     })),
    // }));
    const url = process.env.BASE_URL;
    const cookies = await getCookies('refreshToken');
    const refreshToken = cookies?.value;
    try{
        const response = await fetch(`${url}/bill/getall`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${refreshToken}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message)
        }
    
        const parseDate = (dateString: string): Date => {
            const [day, month, year] = dateString.split('/').map(Number);
            return new Date(year, month - 1, day);
        };
        const fetchedBills: Bill[] = data.map((item: any) => ({
            id: item.billId,
            customer: item.customer ? item.customer.customerName : "Visiting Customer",
            voucherValue: item.voucherValue,
            voucherTypeIndex: item.voucherTypeIndex,
            staff: item.staff ? item.staff.staffName : "Unknown Staff",
            payType: item.payType ? item.payType.payTypeName : "Unknown Pay Type",
            status: item.status,
            totalPrice: item.totalPrice,
            createdAt: parseDate(item.createdAt),
            dateString: item.createdAt,
            billInfo: item.billDetailDTOs.map((info: any) => ({
                productName: info.productName,
                productCount: info.productCount,
                totalPriceDtail: info.totalPriceDtail,
                productPrice: info.productPrice,
            })),
        }));
        return fetchedBills.reverse();
    }catch(e){
        toast.error("Failed to fetch data: " + e);
        return [];
    }
}
