export type BadgeInfo = {
  iconHref: string;
  value: string;
  title: "Total Orders" | "Total Revenue";
};

export type BillReportData = {
  doneCount: number;
  pendingCount: number;
  totalCount: number;
  donePercent: number;
  pendingPercent: number;
};

export type ProductReportData = {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
};
