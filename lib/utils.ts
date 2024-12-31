import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const parseDate = (dateStr: string) => {
	if (dateStr.includes('/')) {
		const [day, month, year] = dateStr.split('/');
		return new Date(`${year}-${month}-${day}`);
	}
	return new Date(dateStr);
};
export const formatMoney = (money: number) => {
	return money.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

export function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}