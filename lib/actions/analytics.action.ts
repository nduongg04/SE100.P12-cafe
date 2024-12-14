"use server";

import { authenticatedFetch } from "../auth";
import { parse, format } from 'date-fns';

const BASE_URL = process.env.BASE_URL;

function formatDateForAPI(dateString: string): string {
  const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
  return format(parsedDate, 'yyyy-MM-dd');
}

export async function getRevenue(start: string, end: string) {
  const startFormatted = formatDateForAPI(start);
  const endFormatted = formatDateForAPI(end);
  
  const res = await authenticatedFetch(
    `${BASE_URL}/report/getrevenue?start=${startFormatted}&end=${endFormatted}`,
  );
  const data = await res.json();
  console.log(data);
  if (!res.ok) {
    throw new Error("Failed to fetch revenue data");
  }
  return data;
}

export async function getRevenueByDate(date: string) {
  const dateFormatted = formatDateForAPI(date);
  const res = await authenticatedFetch(`${BASE_URL}/report/getrevenuebydate/${dateFormatted}`);
  if (!res.ok) {
    throw new Error("Failed to fetch revenue by date");
  }
  return res.json();
}

export async function getProductReport(start: string, end: string) {
  const startFormatted = formatDateForAPI(start);
  const endFormatted = formatDateForAPI(end);
  
  const res = await authenticatedFetch(
    `${BASE_URL}/report/getproductreport?start=${startFormatted}&end=${endFormatted}`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch product report");
  }
  return res.json();
}

export async function getReportBill(start: string, end: string) {
  const startFormatted = formatDateForAPI(start);
  const endFormatted = formatDateForAPI(end);
  
  const res = await authenticatedFetch(
    `${BASE_URL}/report/getreportbill?start=${startFormatted}&end=${endFormatted}`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch bill report");
  }
  return res.json();
}

