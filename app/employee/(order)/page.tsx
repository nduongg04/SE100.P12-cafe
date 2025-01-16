"use client";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import MenuOrder from "./menuOrder";
import { PrdBill } from "./menuOrder";
import BillTable from "./billOrder";
import TableOrder from "./tableOrder";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getAllTable } from "@/lib/actions/table.action";
import {
  BillApi,
  Customer,
  getBillBooking,
  getCategoryData,
  getProductData,
  unBookedTable,
  updateTableStatus,
} from "./fetchingData";
import { toast } from "sonner";
import Loading from "react-loading";
import { Category, Product } from "./menuOrder";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import html2canvas from "html2canvas";
import { getCookies } from "@/lib/action";
type Props = {};

export default function OrderPage({}: Props) {
  const [listPrdBill, setListPrdBill] = React.useState<PrdBill[]>([]);
  const [tableOrder, setTableOrder] = React.useState<number | null>(null);
  const [tabDineIn, setTabDineIn] = React.useState<boolean>(false);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = React.useState<boolean>(true);
  const [tables, setTables] = React.useState<Table[]>([]);
  const [tableNumber, setTableNumber] = React.useState<number | null>(null);
  const [isLoadingUnBooked, setIsLoadingUnbooked] =
    React.useState<boolean>(false);
  const [isLoadingTable, setIsLoadingTable] = React.useState<boolean>(true);
  const [currentTab, setCurrentTab] = React.useState("Dine-in");
  const [bill, setBill] = React.useState<BillApi | null>(null);
  const [openBill, setOpenBill] = React.useState<boolean>(false);
  const [newCustomer, setNewCustomer] = React.useState<Customer | null>(null);
  const [customerName, setCustomerName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [openAddCustomer, setOpenAddCustomer] = React.useState<boolean>(false);
  const [loadingAddCustomer, setLoadingAddCustomer] =
    React.useState<boolean>(false);
  useEffect(() => {
    async function fetchData() {
      console.log("fetch table");
      setIsLoadingTable(true);
      const tables = await getAllTable();
      if (!tables) {
        toast.error("Failed to fetch tables");
        return [];
      }
      setTables(tables);
      setIsLoadingTable(false);
    }

    fetchData();
  }, []);
  useEffect(() => {
    async function fetchData() {
      setIsLoadingMenu(true);
      const category = await getCategoryData();
      const products = await getProductData();
      setCategories(category);
      setProducts(products);
      setIsLoadingMenu(false);
    }
    fetchData();
  }, []);
  const updateStatusTable = (tableId: number, status: string) => {
    const updatedTables = tables.map((table) =>
      table.tableID === tableId ? { ...table, status } : table,
    );
    setTables(updatedTables);
  };
  const handleChooseTable = (tableId: number, tableNumber: number) => {
    setTableOrder(tableId);
    setTableNumber(tableNumber);
    setTabDineIn(true);
  };
  const handleUpdateTableStatus = async (tableId: number, status: string) => {
    setIsLoadingUnbooked(true);
    if (status == "Not booked") {
      const result = await unBookedTable(tableId);
      if (result) {
        updateStatusTable(tableId, status);
        toast.success("Unbooked table successfully");
      }
    }
    if (status == "Under repair") {
      const result = await updateTableStatus(tableId, status);
      if (result) {
        updateStatusTable(tableId, status);
        toast.success("Table under repair successfully");
      }
    }
    if (status == "Repaired") {
      const result = await updateTableStatus(tableId, "Not booked");
      if (result) {
        updateStatusTable(tableId, "Not booked");
        toast.success("Table repaired successfully");
      }
    }
    setIsLoadingUnbooked(false);
  };
  const resetData = () => {
    setListPrdBill([]);
    setTableOrder(null);
    setTableNumber(null);
    setTabDineIn(false);
  };
  const updateProductSoldOut = (id: number, isSoldOut: boolean) => {
    const updatedProducts = products.map((product) =>
      product.ProductId === id ? { ...product, IsSoldOut: isSoldOut } : product,
    );
    setProducts(updatedProducts);
  };
  const handleAddCustomer = async () => {
    setLoadingAddCustomer(true);
    // Validate phone number
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Invalid phone number", {
        description: "Phone number must be 10 digits starting with 0",
      });
      setLoadingAddCustomer(false);
      return;
    }
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email", {
        description: "Please enter a valid email address",
      });
      setLoadingAddCustomer(false);
      return;
    }
    const cookies = await getCookies("refreshToken");
    const token = cookies?.value;
    const url = process.env.BASE_URL;
    try {
      const response = await fetch(`${url}/customer/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: customerName,
          phoneNumber: phoneNumber,
          email: email,
          revenue: 0,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      } else {
        toast.success("Customer added", {
          description: "Customer has been added successfully",
        });
      }
      setCustomerName("");
      setPhoneNumber("");
      setEmail("");
      setNewCustomer({
        customerId: data.data.customerID,
        customerType: data.data.customerType,
        customerName: data.data.customerName,
        phoneNumber: data.data.phoneNumber,
        email: data.data.email,
        revenue: data.data.revenue,
      });
      setOpenAddCustomer(false);
    } catch (e: any) {
      toast.error("Failed to add customer", {
        description: e.message,
      });
    }
    setLoadingAddCustomer(false);
  };
  const showBill = async (tableId: number) => {
    setIsLoadingUnbooked(true);
    const bill = await getBillBooking(tableId);
    if (bill) {
      setBill(bill);
      setOpenBill(true);
    }
    setIsLoadingUnbooked(false);
  };
  const handleGenerateImg = async () => {
    const content = document.querySelector(".dialog-content-to-img");
    if (content instanceof HTMLElement) {
      try {
        // Tạo canvas từ nội dung HTML
        const canvas = await html2canvas(content, { scale: 2 });

        // Chuyển canvas thành ảnh (dạng URL)
        const imgData = canvas.toDataURL("image/png");

        // Tạo thẻ <a> để tải xuống
        const link = document.createElement("a");
        link.href = imgData; // Gán URL của ảnh
        link.download = `bill-${bill?.billId}-${Date.now()}.png`; // Tên file khi tải xuống

        // Tự động kích hoạt tải xuống
        document.body.appendChild(link); // Thêm thẻ vào DOM để kích hoạt
        link.click();
        document.body.removeChild(link); // Xóa thẻ sau khi kích hoạt
      } catch (error) {
        console.error("Lỗi khi tạo ảnh:", error);
      }
    } else {
      console.error("Content không tồn tại.");
    }
    setOpenBill(false);
  };
  return (
    //
    <Tabs value={currentTab} className="mx-2 mt-12 md:mt-2">
      <div className="relative flex items-center justify-between">
        <TabsList className="grid grid-cols-2 lg:w-[30%]">
          <TabsTrigger
            onClick={() => {
              resetData();
              setCurrentTab("Dine-in");
            }}
            value="Dine-in"
            className="flex items-start justify-center p-2 text-xl font-semibold"
          >
            {tabDineIn && <ChevronLeft className="h-7 w-7" />}
            <p className={`w-full ${tabDineIn ? "-mt-[1px] pr-6" : ""}`}>
              Dine-in
            </p>
          </TabsTrigger>
          <TabsTrigger
            onClick={() => {
              resetData();
              setCurrentTab("Take-away");
            }}
            value="Take-away"
            className="items-start justify-start p-2 text-xl font-semibold"
          >
            <p className="w-full text-center">Take-away</p>
          </TabsTrigger>
        </TabsList>
        <div className="absolute right-1 top-[-2rem] min-[520px]:top-3 flex items-center">
          {tableOrder && tableNumber && (
            <p className="mr-5 text-xl font-semibold">Bàn #{tableNumber}</p>
          )}
          {(tabDineIn || currentTab == "Take-away") && (
            <Button
              onClick={() => setOpenAddCustomer(true)}
              className="bg-dark-green text-white hover:bg-dark-green-foreground active:scale-95 active:shadow-lg"
            >
              Add new customer
            </Button>
          )}
        </div>
      </div>

      <TabsContent value="Dine-in">
        {tabDineIn ? (
          <div className="flex h-full w-full flex-col lg:flex-row">
            <div className="mt-2 basis-3/6">
              <MenuOrder
                listPrdBill={listPrdBill}
                setListPrdBill={setListPrdBill}
                productsData={products}
                categoriesData={categories}
                loading={isLoadingMenu}
                soldOut={updateProductSoldOut}
              />
            </div>
            <div className="mt-2 basis-3/6">
              <BillTable
                data={listPrdBill}
                setData={setListPrdBill}
                tableOrder={tableOrder}
                updateStatus={updateStatusTable}
                resetData={resetData}
                newCustomer={newCustomer}
              ></BillTable>
            </div>
          </div>
        ) : (
          <div className="relative mt-6">
            {isLoadingUnBooked && (
              <div className="absolute inset-0 z-50 flex h-full w-full items-center justify-center rounded-lg bg-black bg-opacity-50">
                <Loading type="spin" color="#fff" height={40} width={40} />
              </div>
            )}
            <TableOrder
              setTableOrder={handleChooseTable}
              tables={tables}
              isFetching={isLoadingTable}
              updateStatus={handleUpdateTableStatus}
              showBill={showBill}
            />
          </div>
        )}
      </TabsContent>
      <TabsContent value="Take-away">
        <div className="mt-2 flex flex-col lg:flex-row">
          <div className="mt-2 lg:basis-3/6">
            <MenuOrder
              listPrdBill={listPrdBill}
              setListPrdBill={setListPrdBill}
              productsData={products}
              categoriesData={categories}
              loading={isLoadingMenu}
              soldOut={updateProductSoldOut}
            />
          </div>
          <div className="mt-2 basis-3/6">
            <BillTable
              resetData={resetData}
              data={listPrdBill}
              setData={setListPrdBill}
              tableOrder={null}
              updateStatus={updateStatusTable}
              newCustomer={newCustomer}
            ></BillTable>
          </div>
        </div>
      </TabsContent>
      {/* dialog bill */}
      <Dialog open={openBill} onOpenChange={setOpenBill}>
        <DialogContent className="px-3 sm:max-w-[470px]">
          <div className="h-auto overflow-visible">
            <ScrollArea className="h-[80vh]">
              <div className="dialog-content-to-img overflow-visible px-3 pb-2">
                <div>
                  <p className="font-petrona_bold text-5xl"> HiCoffee</p>
                  <p className="font-barlow_medium text-base text-[#B9BBBD]">
                    Take it easy
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-barlowCondensed_semibold text-4xl">
                    Hóa đơn
                  </p>
                  <p className="font-barlow_medium text-base">
                    Mã HĐ: {bill?.billId}
                  </p>
                </div>
                <div className="mb-2 mt-2 px-3">
                  <div className="flex justify-between font-roboto_regular text-base text-[#6A6A6A]">
                    <p>Ngày tạo</p>
                    <p>
                      {new Date().toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex justify-between font-roboto_regular text-base text-[#6A6A6A]">
                    <p>Khách hàng</p>
                    <p>{bill?.customer?.customerName || "Khách vãng lai"}</p>
                  </div>
                  <div className="flex justify-between font-roboto_regular text-base text-[#6A6A6A]">
                    <p>Nhân viên lập hóa đơn</p>
                    <p>{bill?.staff?.staffName}</p>
                  </div>
                  <div className="flex justify-between font-roboto_regular text-base text-[#6A6A6A]">
                    <p>Phương thức thanh toán</p>
                    <p>{bill?.payType?.payTypeName}</p>
                  </div>
                </div>
                <div className="bg-white">
                  <table className="mt-2 w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-300 font-roboto_regular">
                        <th className="w-[40%] border-r border-gray-300 px-2 pb-2 pt-[-8px]">
                          Tên món
                        </th>
                        <th className="w-[10%] border-r border-gray-300 px-2 pb-2">
                          SL
                        </th>
                        <th className="w-[20%] border-r border-gray-300 px-2 pb-2">
                          Đơn giá
                        </th>
                        <th className="w-[25%] border-gray-300 px-2 pb-2">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="font-roboto_light">
                      {bill?.billDetailDTOs.map((item, index) => (
                        <tr key={index}>
                          <td className="border-b border-dashed border-gray-300 p-2">
                            {item.productName}
                          </td>
                          <td className="border-b border-dashed border-gray-300 p-2 text-center">
                            {item.productCount}
                          </td>
                          <td className="border-b border-dashed border-gray-300 p-2 text-center">
                            {item.productPrice.toLocaleString("vi-VN")}
                          </td>
                          <td className="border-b border-dashed border-gray-300 p-2 text-center">
                            {item.totalPriceDtail.toLocaleString("vi-VN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mb-2 ml-auto mr-3 mt-2 flex flex-row justify-end gap-4 font-roboto_regular text-base">
                  <div>
                    <p className="text-end">Tổng : </p>
                    {bill?.customer?.customerType && (
                      <h2 className="text-end">
                        Thành viên{" "}
                        {bill?.customer?.customerType?.customerTypeName} -
                        {bill?.customer?.customerType?.discountValue}% :{" "}
                      </h2>
                    )}
                    {bill?.voucherTypeIndex != 0 && (
                      <h2 className="text-end">
                        Voucher{" "}
                        {bill?.voucherTypeIndex == 2
                          ? `-${bill?.voucherValue}`
                          : `-${bill?.voucherValue}%`}{" "}
                        :
                      </h2>
                    )}
                    <h2 className="mt-1 pt-1 text-end font-semibold">
                      Thành tiền :
                    </h2>
                  </div>
                  <div className="min-w-[100px]">
                    <p className="text-end">
                      {bill?.totalPrice.toLocaleString("vi-VN")} đ
                    </p>
                    {bill?.customer?.customerType && (
                      <p className="text-end">
                        -{" "}
                        {(
                          (bill?.totalPrice *
                            bill?.customer?.customerType?.discountValue) /
                          100
                        ).toLocaleString("vi-VN")}{" "}
                        đ
                      </p>
                    )}
                    {bill?.voucherTypeIndex == 1 && (
                      <p className="text-end">
                        -{" "}
                        {(
                          (bill?.totalPrice * (bill?.voucherValue || 0)) /
                          100
                        ).toLocaleString("vi-VN")}{" "}
                        đ
                      </p>
                    )}
                    {bill?.voucherTypeIndex == 2 && (
                      <p className="text-end">
                        - {bill?.voucherValue?.toLocaleString("vi-VN")} đ
                      </p>
                    )}
                    <p className="mt-1 border-t border-gray-600 pt-[2px] text-end text-lg font-semibold">
                      {bill?.totalPrice.toLocaleString("vi-VN")} đ
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button
              className="mr-3"
              onClick={() => {
                handleGenerateImg();
              }}
              type="submit"
            >
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* dialog add customer */}
      <Dialog open={openAddCustomer} onOpenChange={setOpenAddCustomer}>
        <DialogContent>
          {loadingAddCustomer && (
            <div className="absolute inset-0 z-50 flex h-full w-full items-center justify-center rounded-lg bg-black bg-opacity-50">
              <Loading type="spin" color="#fff" height={40} width={40} />
            </div>
          )}
          <DialogHeader>
            <DialogTitle>Add new customer</DialogTitle>
            <DialogDescription>
              Add new customer here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid w-[100%] gap-4 py-4">
            <table className="border-separate border-spacing-2">
              <tr>
                <td>Full name</td>
                <td>
                  <Input
                    placeholder="Fullname"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Phone Number</td>
                <td>
                  <Input
                    placeholder="Phone Number"
                    value={phoneNumber}
                    required
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>Email</td>
                <td>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </td>
              </tr>
            </table>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-500"
              onClick={handleAddCustomer}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
