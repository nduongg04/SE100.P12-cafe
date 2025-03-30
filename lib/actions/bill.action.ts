import { authenticatedFetch } from "../auth";
import { ApiLoggerDecorator } from "../decorator/apiLogger";

export const updateBillStatus = async (billId: number, status: string) => {
  const response = await authenticatedFetch(`${process.env.BASE_URL}/bill/updatestatus/${billId}`, { method: "PUT", body: JSON.stringify({ status }) });
  return await response.json();
};
export const getAllBills = async () => {
  try {
    const response = await authenticatedFetch(`${process.env.BASE_URL}/bill/getall`, { method: "GET" });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updateBillStatusDecorator = new ApiLoggerDecorator(updateBillStatus).execute;