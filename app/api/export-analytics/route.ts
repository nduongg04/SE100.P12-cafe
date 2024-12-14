import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';

export async function POST(req: NextRequest) {
  const { revenueData, productReportData, billReportData, startDate, endDate } = await req.json();

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Analytics Report');

  // Add report header
  worksheet.addRow(['Analytics Report']);
  worksheet.addRow([`From: ${new Date(startDate).toLocaleDateString()} To: ${new Date(endDate).toLocaleDateString()}`]);
  worksheet.addRow([]);

  // Add revenue data
  worksheet.addRow(['Revenue Data']);
  worksheet.addRow(['Date', 'Revenue']);
  revenueData.reportRecordRevenues.forEach((item: any) => {
    worksheet.addRow([item.dateTime, item.revenue]);
  });
  worksheet.addRow([]);

  // Add product report data
  worksheet.addRow(['Product Report']);
  worksheet.addRow(['Product Name', 'Category', 'Order Count']);
  productReportData.forEach((item: any) => {
    worksheet.addRow([item.product.productName, item.product.categoryName, item.orderCount]);
  });
  worksheet.addRow([]);

  // Add bill report data
  worksheet.addRow(['Bill Report']);
  worksheet.addRow(['Total Count', 'Done Count', 'Pending Count', 'Done Percent', 'Pending Percent']);
  worksheet.addRow([
    billReportData.totalCount,
    billReportData.doneCount,
    billReportData.pendingCount,
    billReportData.donePercent,
    billReportData.pendingPercent
  ]);

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=analytics_report.xlsx',
    },
  });
}

