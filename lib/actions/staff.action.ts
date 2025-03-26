"use server";

import { authenticatedFetch } from "../auth";
import { toast } from "sonner";
export const getAllStaff = async () => {
  try {
    const response = await authenticatedFetch(`${process.env.BASE_URL}/staff/getall`, { method: "GET" });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const deleteStaff = async (staffId: string) => {
  try {
    console.log("staffId: ", staffId);
    const response = await authenticatedFetch(`${process.env.BASE_URL}/staff/delete/${staffId}`, { method: "DELETE" });
    console.log("response: ", response);
    if(!response.ok)
    {
      return null;
    }
    return "success";
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const addStaff = async (staff: Omit<Staff, 'staffId'>) => {
  try {
    console.log("staff: ", staff);
    const response = await authenticatedFetch(`${process.env.BASE_URL}/auth/register`, { method: "POST",headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify(staff) });
    console.log("response: ", response);
    if(!response.ok)
    {
      const errorData = await response.json(); // Lấy dữ liệu lỗi từ phản hồi
      console.error("Error details: ", errorData); // In ra chi tiết lỗi
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
