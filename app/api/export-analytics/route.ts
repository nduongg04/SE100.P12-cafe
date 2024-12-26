import { format } from "date-fns";
import Excel from "exceljs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      revenueData,
      productReportData,
      billReportData,
      customerReviews,
      startDate,
      endDate,
    } = data;

		console.log(revenueData,
      productReportData,
      billReportData,
      customerReviews,
      startDate,
      endDate,
    );

    const workbook = new Excel.Workbook();

    // Summary Sheet
    const summarySheet = workbook.addWorksheet("Summary");
    summarySheet.columns = [
      { header: "Metric", key: "metric", width: 20 },
      { header: "Value", key: "value", width: 20 },
    ];
    summarySheet.addRows([
      { metric: "Total Orders", value: billReportData.totalCount },
      { metric: "Total Revenue", value: revenueData.totalValue },
      { metric: "Completed Orders", value: billReportData.doneCount },
      { metric: "Pending Orders", value: billReportData.pendingCount },
      {
        metric: "Order Completion Rate",
        value: `${billReportData.donePercent}%`,
      },
      { metric: "Report Period", value: `${startDate} to ${endDate}` },
      {
        metric: "Generated On",
        value: format(new Date(), "dd/MM/yyyy HH:mm:ss"),
      },
    ]);

    // Revenue Over Time Sheet
    const revenueSheet = workbook.addWorksheet("Revenue Over Time");
    revenueSheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Revenue", key: "revenue", width: 15 },
    ];
    revenueData.reportRecordRevenues.forEach((item: any) => {
      const [day, month, year] = item.dateTime.split("/");
      const formattedDate = format(
        new Date(year, month - 1, day),
        "dd/MM/yyyy",
      );
      revenueSheet.addRow({
        date: formattedDate,
        revenue: item.revenue,
      });
    });
    revenueSheet.addRow({
      date: "Total",
      revenue: revenueData.totalValue,
    });

    // Top Products Sheet
    const productsSheet = workbook.addWorksheet("Top Products");
    productsSheet.columns = [
      { header: "Rank", key: "rank", width: 10 },
      { header: "Product Name", key: "name", width: 30 },
      { header: "Quantity Sold", key: "quantity", width: 15 },
      { header: "Revenue", key: "revenue", width: 15 },
    ];
    productReportData.forEach((item: any, index: number) => {
      productsSheet.addRow({
        rank: index + 1,
        name: item.product.productName,
        quantity: item.orderCount,
        revenue: item.product.price * item.orderCount,
      });
    });

    // Order Status Sheet
    const orderStatusSheet = workbook.addWorksheet("Order Status");
    orderStatusSheet.columns = [
      { header: "Status", key: "status", width: 20 },
      { header: "Count", key: "count", width: 15 },
      { header: "Percentage", key: "percentage", width: 15 },
    ];
    orderStatusSheet.addRows([
      {
        status: "Completed Orders",
        count: billReportData.doneCount,
        percentage: `${billReportData.donePercent}%`,
      },
      {
        status: "Pending Orders",
        count: billReportData.pendingCount,
        percentage: `${billReportData.pendingPercent}%`,
      },
      {
        status: "Total Orders",
        count: billReportData.totalCount,
        percentage: "100%",
      },
    ]);

    // Customer Reviews Sheet
    const reviewsSheet = workbook.addWorksheet("Customer Reviews");
    reviewsSheet.columns = [
      { header: "Rating", key: "rating", width: 10 },
      { header: "Customer Name", key: "name", width: 25 },
      { header: "Review", key: "review", width: 50 },
    ];
    if (customerReviews && customerReviews.length > 0) {
      customerReviews.forEach((review: any) => {
        reviewsSheet.addRow({
          rating: review.starNumber,
          name: review.fullname || "Anonymous",
          review: review.content,
        });
      });
    }

    // Style the sheets
    [
      summarySheet,
      revenueSheet,
      productsSheet,
      orderStatusSheet,
      reviewsSheet,
    ].forEach((sheet) => {
      // Style headers
      sheet.getRow(1).font = { bold: true };
      sheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=analytics_report_${startDate}_${endDate}.xlsx`,
      },
    });
  } catch (error) {
    console.error("Error generating Excel:", error);
    return NextResponse.json(
      { error: "Failed to generate Excel file" },
      { status: 500 },
    );
  }
}
