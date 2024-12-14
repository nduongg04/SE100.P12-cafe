"use client";

import { useState, useEffect, useRef } from "react";
import { DateRange } from "react-day-picker";
import { format, addDays, differenceInDays } from "date-fns";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { authenticatedFetch } from "@/lib/auth";

import Badge from "@/components/admin/Badge";
import { PieChartComponent } from "@/components/admin/PieChartComponent";
import { AreaChartComponent } from "@/components/admin/AreaChartComponent";
import TopDishes from "@/components/admin/TopDishes";
import { FeedbackDisplay } from "@/components/admin/FeedbackDisplay";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import { getProductReport, getReportBill, getRevenue } from "@/lib/actions/analytics.action";

export default function AnalyticsClient() {
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  const [analyticsData, setAnalyticsData] = useState({
    revenueData: { totalValue: 0, reportRecordRevenues: [] },
    productReportData: [],
    billReportData: { totalCount: 0, doneCount: 0, pendingCount: 0, donePercent: 0, pendingPercent: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const initialFetchDone = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!initialFetchDone.current) {
        setIsLoading(true);
        try {
          const startDate = selectedDate?.from ? format(selectedDate.from, "dd/MM/yyyy") : format(addDays(new Date(), -7), "dd/MM/yyyy");
          const endDate = selectedDate?.to ? format(selectedDate.to, "dd/MM/yyyy") : format(new Date(), "dd/MM/yyyy");

          const [newRevenueData, newProductReport, newBillReport] = await Promise.all([
            getRevenue(startDate, endDate),
            getProductReport(startDate, endDate),
            getReportBill(startDate, endDate),
          ]);

          setAnalyticsData({
            revenueData: newRevenueData,
            productReportData: newProductReport,
            billReportData: newBillReport,
          });
          initialFetchDone.current = true;
        } catch (error) {
          console.error("Error fetching data:", error);
          setAnalyticsData({
            revenueData: { totalValue: 0, reportRecordRevenues: [] },
            productReportData: [],
            billReportData: { totalCount: 0, doneCount: 0, pendingCount: 0, donePercent: 0, pendingPercent: 0 },
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    if (initialFetchDone.current) {
      setIsLoading(true);
      const fetchData = async () => {
        try {
          const startDate = selectedDate?.from ? format(selectedDate.from, "dd/MM/yyyy") : format(addDays(new Date(), -7), "dd/MM/yyyy");
          const endDate = selectedDate?.to ? format(selectedDate.to, "dd/MM/yyyy") : format(new Date(), "dd/MM/yyyy");

          const [newRevenueData, newProductReport, newBillReport] = await Promise.all([
            getRevenue(startDate, endDate),
            getProductReport(startDate, endDate),
            getReportBill(startDate, endDate),
          ]);

          setAnalyticsData({
            revenueData: newRevenueData,
            productReportData: newProductReport,
            billReportData: newBillReport,
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [selectedDate]);

  const handleDateSelect = (newDate: DateRange | undefined) => {
    if (newDate?.from && newDate?.to) {
      const daysDiff = differenceInDays(newDate.to, newDate.from);
      if (daysDiff > 30) {
        toast({
          title: "Date Range Too Long",
          description: "Please select a period of 30 days or less",
          variant: "destructive",
        });
        return;
      }
    }
    setSelectedDate(newDate);
  };

  const badgeInfos = [
    {
      iconHref: "/assets/icons/orders.svg",
      value: analyticsData.billReportData.totalCount.toString(),
      title: "Total Orders",
    },
    {
      iconHref: "/assets/icons/revenue.svg",
      value: analyticsData.revenueData.totalValue.toString(),
      title: "Total Revenue",
    },
  ];

  // const exportToExcel = async () => {
  //   try {
  //     const startDate = selectedDate?.from ? format(selectedDate.from, "dd/MM/yyyy") : format(addDays(new Date(), -7), "dd/MM/yyyy");
  //     const endDate = selectedDate?.to ? format(selectedDate.to, "dd/MM/yyyy") : format(new Date(), "dd/MM/yyyy");

  //     const response = await authenticatedFetch('/api/export-analytics', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         ...analyticsData,
  //         startDate,
  //         endDate,
  //       }),
  //     });

  //     if (response.ok) {
  //       const blob = await response.blob();
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.style.display = 'none';
  //       a.href = url;
  //       a.download = 'analytics_report.xlsx';
  //       document.body.appendChild(a);
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //     } else {
  //       console.error('Failed to export Excel file');
  //     }
  //   } catch (error) {
  //     console.error('Error exporting to Excel:', error);
  //   }
  // };

  return (
    <div className="font-barlow flex flex-1 flex-col gap-10 py-4">
      <div className="flex items-center justify-between gap-10">
        <div className="flex flex-1 flex-wrap items-center justify-between gap-10">
          <div className="flex flex-col gap-1 max-md:ml-16">
            <h1 className="text-xl font-semibold">Analytics</h1>
            <p className="text-sm text-gray-500">
              Let's see analytics of the coffee shop
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger>
                <div className="shadow-black-medium flex items-center gap-2 rounded-lg bg-white px-4 py-2">
                  <div className="h-full rounded-lg bg-[#2D9CDB]/15 p-1">
                    <Image
                      src="/assets/icons/calendar.svg"
                      width={30}
                      height={30}
                      alt="calendar"
                    />
                  </div>
                  <div className="flex flex-col justify-start gap-0.5">
                    <span className="text-start text-sm font-medium">
                      Filter Period
                    </span>
                    <span className="font text-xs">
                      {format(
                        selectedDate?.from || new Date(),
                        "dd MMM yyyy",
                      )}{" "}
                      -{" "}
                      {format(selectedDate?.to || new Date(), "dd MMM yyyy")}
                    </span>
                  </div>
                  <Image
                    src="/assets/icons/chevron-down.svg"
                    width={20}
                    height={20}
                    alt="calendar"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={selectedDate?.from}
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                  disabled={(date) =>
                    selectedDate?.from && differenceInDays(date, selectedDate.from) > 30 ? true : false
                  }
                />
              </PopoverContent>
            </Popover>
            {/* <Button onClick={exportToExcel}>Export to Excel</Button> */}
          </div>
        </div>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex flex-wrap justify-between gap-6">
            {badgeInfos.map((badgeInfo, index) => (
              <Badge
                key={index}
                iconHref={badgeInfo.iconHref}
                value={badgeInfo.value}
                title={badgeInfo.title}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-y-6 md:gap-x-6 md:grid-cols-3">
            <PieChartComponent className="col-span-1" data={analyticsData.billReportData} />
            <AreaChartComponent
              className="col-span-2"
              data={analyticsData.revenueData.reportRecordRevenues}
              startDate={selectedDate?.from}
              endDate={selectedDate?.to}
            />
          </div>
          <TopDishes data={analyticsData.productReportData} />
        </>
      )}
      <FeedbackDisplay />
    </div>
  );
}

