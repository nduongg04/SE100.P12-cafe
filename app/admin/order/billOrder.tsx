import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { PrdBill } from "./menuOrder";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import React, { useEffect, useRef, useState } from "react";
import { Trash2, Plus, Minus, SearchCheck, CircleX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCustomerData } from "./fetchingData";
import { addBooking, Customer } from "./fetchingData";
import { toast } from "sonner";
import Loading from "react-loading";
import { getCookies } from "@/lib/action";
import { User } from "@/app/login/page";
import html2canvas from "html2canvas";
import { getAllVoucher } from "./fetchingData";

type Props = {
  data: PrdBill[];
  setData: React.Dispatch<React.SetStateAction<PrdBill[]>>;
  tableOrder: number | null;
  updateStatus: (tableId: number, status: string) => void;
  resetData: () => void;
  newCustomer: Customer | null;
};
export default function BillTable({
  data,
  setData,
  tableOrder,
  updateStatus,
  resetData,
  newCustomer,
}: Props) {
  const url = process.env.BASE_URL;
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [listCustomer, setListCustomer] = useState<Customer[]>([]);
  const [listVoucher, setListVoucher] = useState<VoucherApi[]>([]);
  const [voucher, setVoucher] = useState<VoucherApi | null>(null);
  const [searchVoucher, setSearchVoucher] = useState<string>("");
  const [searchCustomer, setSearchCustomer] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [totalBill, setTotalBill] = useState<number>(0);
  const [idBill, setIdBill] = useState<number>(0);
  const [payType, setPayType] = useState<string>("Chuyển khoản");
  const [openBill, setOpenBill] = useState<boolean>(false);
  const [openPayType, setOpenPayType] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [finishedBill, setFinishedBill] = useState(false);
  const [suggestCustomer, setSuggestCustomer] = useState<Customer[]>([]);
  const [openSuggestCustomer, setOpenSuggestCustomer] = useState(false);
  const [openSuggestVoucher, setOpenSuggestVoucher] = useState(false);
  const [suggestVoucher, setSuggestVoucher] = useState<VoucherApi[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const cookies = await getCookies("user");
      if (cookies?.value) {
        setUser(JSON.parse(cookies.value));
      }
      const datas = await getCustomerData();
      setListCustomer(datas);
      const vouchers = await getAllVoucher();
      const filteredVouchers = vouchers.filter((item) => {
        const [dayExpired, monthExpired, yearExpired] = item.expiredDate
          .split("/")
          .map(Number);
        const expiredDate = new Date(yearExpired, monthExpired - 1, dayExpired);
        const [dayCreate, monthCreate, yearCreate] = item.createdDate
          .split("/")
          .map(Number);
        const createDate = new Date(yearCreate, monthCreate - 1, dayCreate);
        const currentDate = new Date();
        if (
          item.maxApply > 0 &&
          expiredDate > currentDate &&
          createDate < currentDate
        ) {
          return item;
        }
      });
      setListVoucher(filteredVouchers);
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (newCustomer) {
      setListCustomer([...listCustomer, newCustomer]);
    }
  }, [newCustomer]);
  useEffect(() => {
    const total = data.reduce((acc, item) => acc + item.Total, 0);
    setTotal(total);
    let discountCus = 0;
    let discountVoucher = 0;
    let totalBill2 = total;
    if (customer?.customerType) {
      discountCus = (total * customer.customerType.discountValue) / 100;
    }
    if (voucher) {
      if (voucher.voucherType.voucherTypeID == 1) {
        discountVoucher = (total * voucher.voucherValue) / 100;
      } else if (voucher.voucherType.voucherTypeID == 2) {
        discountVoucher = voucher.voucherValue;
      }
      if (totalBill2 <= 0) {
        totalBill2 = 0;
      }
    }
    totalBill2 = totalBill2 - discountCus - discountVoucher;
    setTotalBill(totalBill2);
  }, [customer, voucher, data]);
  useEffect(() => {
    if (finishedBill && !openBill) {
      resetData();
      resetBill();
      setFinishedBill(false);
    }
  }, [finishedBill, openBill]);
  const resetBill = () => {
    setData([]);
    setCustomer(null);
    setVoucher(null);
    setSearchCustomer("");
    setSearchVoucher("");
  };

  const handleGenerateImg = async () => {
    const content = document.querySelector(".dialog-content-to-pdf");
    if (content instanceof HTMLElement) {
      try {
        // Tạo canvas từ nội dung HTML
        const canvas = await html2canvas(content, { scale: 2 });

        // Chuyển canvas thành ảnh (dạng URL)
        const imgData = canvas.toDataURL("image/png");

        // Tạo thẻ <a> để tải xuống
        const link = document.createElement("a");
        link.href = imgData; // Gán URL của ảnh
        link.download = `bill-${idBill}-${Date.now()}.png`; // Tên file khi tải xuống

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

  const handleAddBooking = async (billId: number, tableId: number) => {
    const res = await addBooking(billId, tableId);
    if (res) {
      updateStatus(tableId, "Booked");
    }
  };
  const addBill = async (payType: number) => {
    if (payType == 1) {
      setPayType("Chuyển khoản");
    } else {
      setPayType("Tiền mặt");
    }
    if (data.length != 0) {
      setOpenPayType(false);
      setLoading(true);
      const cookies = await getCookies("refreshToken");
      const token = cookies?.value;
      const url = process.env.BASE_URL;
      const billDetails = data.map((item) => ({
        productId: item.ProductId,
        productName: item.ProductName,
        productPrice: item.Price,
        productCount: item.Quantity,
        totalPriceDtail: item.Total,
      }));
      try {
        console.log(
          JSON.stringify({
            staffId: user?.staffId,
            status: tableOrder ? "Pending" : "Successful",
            totalPrice: totalBill,
            customerId: customer?.customerId,
            voucherId: voucher?.voucherID,
            payTypeId: payType,
            billDetails: billDetails,
          }),
        );
        const response = await fetch(`${url}/bill/create`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            staffId: user?.staffId,
            status: tableOrder ? "Pending" : "Successful",
            totalPrice: totalBill,
            customerId: customer?.customerId,
            voucherId: voucher?.voucherID,
            payTypeId: payType,
            billDetails: billDetails,
          }),
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          throw new Error(data.message);
        } else {
          if (tableOrder) {
            await handleAddBooking(data.data.billId, tableOrder);
          }
          setIdBill(data.data.billId);
          setOpenBill(true);
          setFinishedBill(true);
        }
      } catch (e) {
        toast.error("Failed to add customer: " + e);
      }
      setLoading(false);
    }
  };
  const handleDelete = (id: number) => {
    setData((prevList) => prevList.filter((item) => item.ProductId !== id));
  };
  const handleQuantityChange = (index: number, quantity: number) => {
    if (quantity < 1) {
      quantity = 1;
    }
    setData((prevList) =>
      prevList.map((item, idx) =>
        idx === index
          ? { ...item, Quantity: quantity, Total: quantity * item.Price }
          : item,
      ),
    );
  };
  const handleChooseCustomer = (customer: Customer) => {
    setCustomer(customer);
    setSearchCustomer("");
    setOpenSuggestCustomer(false);
    setSuggestCustomer([]);
  };
  useEffect(() => {
    if (searchCustomer.length > 0) {
      const find = listCustomer.filter(
        (item) =>
          item.phoneNumber.includes(searchCustomer) ||
          item.email.includes(searchCustomer),
      );
      if (!find) {
        setSuggestCustomer([]);
      } else {
        setSuggestCustomer(find);
      }
      setOpenSuggestCustomer(true);
    } else {
      setOpenSuggestCustomer(false);
      setSuggestCustomer([]);
    }
  }, [searchCustomer]);
  const handleChooseVoucher = (voucher: VoucherApi) => {
    setVoucher(voucher);
    setSearchVoucher("");
    setOpenSuggestVoucher(false);
    setSuggestVoucher([]);
  };
  useEffect(() => {
    if (searchVoucher.length > 0) {
      const find = listVoucher.filter((item) =>
        item.voucherCode.includes(searchVoucher),
      );
      if (find.length > 0) {
        setSuggestVoucher(find);
      } else {
        setSuggestVoucher([]);
      }
      setOpenSuggestVoucher(true);
    } else {
      setSuggestVoucher([]);
      setOpenSuggestVoucher(false);
    }
  }, [searchVoucher]);
  const columns: ColumnDef<PrdBill>[] = [
    {
      id: "action",
      cell: ({ row }) => {
        return (
          <div>
            <Button
              variant="ghost"
              onClick={() => handleDelete(row.original.ProductId)}
              className="ml-2 mr-0 p-1"
            >
              <Trash2 />
            </Button>
          </div>
        );
      },
    },
    {
      header: "STT",
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "Tên món",
      accessorKey: "ProductName",
      cell: ({ row }) => {
        return <p className="w-40">{row.getValue("ProductName")}</p>;
      },
    },
    {
      header: "Số lượng",
      accessorKey: "Quantity",
      cell: ({ row }) => {
        const [value, setValue] = useState<string | number>(
          row.getValue("Quantity"),
        );
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          // setValue(Number(e.target.value))
          handleQuantityChange(row.index, Number(e.target.value));
        };
        return (
          <div className="flex">
            <Input
              type="number"
              min={1}
              value={value}
              onChange={(e) => handleChange(e)}
              className="w-16"
            />
          </div>
        );
      },
    },
    {
      header: "Đơn giá",
      accessorKey: "Price",
    },
    {
      header: "Thành tiền",
      accessorKey: "Total",
    },
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  return (
    <div className="mb-2 ml-2 mt-2 h-full min-w-fit rounded-lg bg-white px-3 pt-3 shadow-sm lg:relative">
      <div className="flex justify-between">
        <div
          className="relative flex items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <h2>Customer:</h2>

          {customer ? (
            <>
              <p className="ml-2 truncate border-b border-gray-400 font-semibold">
                {customer.customerName}
              </p>
              <Button
                variant="ghost"
                className="ml-2 p-1"
                onClick={() => setCustomer(null)}
              >
                <CircleX size={20} color="gray" />
              </Button>
            </>
          ) : (
            <>
              <Input
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
                onFocus={() => {
                  if (suggestCustomer.length > 0) {
                    setOpenSuggestCustomer(true);
                  }
                }}
                onBlur={() => {
                  setOpenSuggestCustomer(false);
                }}
                className="ml-3 h-8 w-[8.5rem]"
              />
              <SearchCheck color="gray" className="ml-2" />
            </>
          )}
          {openSuggestCustomer && (
            <div className="absolute -left-1 top-10 z-50 w-72 rounded-md border border-gray-200 bg-white shadow-md">
              <ScrollArea className="h-[300px]">
                {suggestCustomer.length > 0 ? (
                  suggestCustomer.map((item) => (
                    <div
                      key={item.customerId}
                      className="cursor-pointer border-b border-gray-200 px-4 py-1 hover:bg-gray-100"
                      onMouseDown={() => handleChooseCustomer(item)}
                    >
                      <p className="font-semibold">{item.customerName}</p>
                      <p className="-mt-[2px] text-sm text-gray-500">
                        {item.phoneNumber}
                      </p>
                      <p className="-mt-[2px] text-sm text-gray-500">
                        {item.email}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="mt-[40%] text-center font-semibold">
                    Không tìm thấy khách hàng
                  </p>
                )}
              </ScrollArea>
            </div>
          )}
        </div>

        <div className="relative flex items-center">
          <h2>Voucher:</h2>
          {voucher ? (
            <>
              <p className="ml-2 truncate border-b border-gray-400 font-semibold">
                {voucher.voucherCode}
              </p>
              <Button
                variant="ghost"
                className="ml-2 mr-1 p-1"
                onClick={() => setVoucher(null)}
              >
                <CircleX size={20} color="gray" />
              </Button>
            </>
          ) : (
            <>
              <Input
                value={searchVoucher}
                onChange={(e) => setSearchVoucher(e.target.value)}
                onFocus={() => {
                  if (suggestVoucher.length > 0) {
                    setOpenSuggestVoucher(true);
                  }
                }}
                onBlur={() => {
                  setOpenSuggestVoucher(false);
                }}
                className="ml-3 h-8 w-[8.5rem]"
              />
              <SearchCheck color="gray" className="ml-2" />
            </>
          )}
          {openSuggestVoucher && (
            <div className="absolute -left-1 top-10 z-50 w-64 rounded-md border border-gray-200 bg-white shadow-md">
              <ScrollArea className="h-[300px]">
                {suggestVoucher.length > 0 ? (
                  suggestVoucher.map((item) => (
                    <div
                      key={item.voucherID}
                      className="cursor-pointer border-b border-gray-200 px-4 py-1 hover:bg-gray-100"
                      onMouseDown={() => handleChooseVoucher(item)}
                    >
                      <p className="font-semibold">{item.voucherCode}</p>
                      <p className="-mt-[2px] text-sm text-gray-500">
                        - {item.voucherValue}{" "}
                        {item.voucherType.voucherTypeID == 1 ? "%" : "đ"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="mt-[40%] text-center font-semibold">
                    Không tìm thấy voucher
                  </p>
                )}
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
      <ScrollArea className="mt-4 h-[56vh] rounded-md border-2 border-gray-400 pb-1">
        <div className="h-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
      <div className="mb-2 ml-auto mr-3 mt-2 flex flex-row justify-end gap-4">
        <div>
          <p className="text-end">Tổng : </p>
          {customer?.customerType && (
            <h2 className="text-end">
              Thành viên {customer.customerType?.customerTypeName} -
              {customer.customerType?.discountValue}% :{" "}
            </h2>
          )}
          {voucher && (
            <h2 className="text-end">
              Voucher{" "}
              {voucher.voucherType.voucherTypeID == 2
                ? `-${voucher.voucherValue}`
                : `-${voucher.voucherValue}%`}{" "}
              :
            </h2>
          )}
          <h2 className="mt-1 pt-1 text-end font-semibold">Thành tiền :</h2>
        </div>
        <div className="min-w-[100px]">
          <p className="text-end">{total.toLocaleString("vi-VN")} đ</p>
          {customer?.customerType && (
            <p className="text-end text-red-500">
              -{" "}
              {(
                (total * customer.customerType?.discountValue) /
                100
              ).toLocaleString("vi-VN")}{" "}
              đ
            </p>
          )}
          {voucher?.voucherType.voucherTypeID == 1 && (
            <p className="text-end text-red-500">
              - {((total * voucher.voucherValue) / 100).toLocaleString("vi-VN")}{" "}
              đ
            </p>
          )}
          {voucher?.voucherType.voucherTypeID == 2 && (
            <p className="text-end text-red-500">
              - {voucher.voucherValue.toLocaleString("vi-VN")} đ
            </p>
          )}
          <p className="mt-1 border-t border-gray-600 pt-1 text-end font-semibold">
            {totalBill.toLocaleString("vi-VN")} đ
          </p>
        </div>
      </div>
      <div className="mr-3 mt-4 flex justify-end gap-2 lg:absolute lg:bottom-2 lg:right-1">
        <Button
          onClick={resetBill}
          disabled={data.length == 0}
          className="bg-red-500 transition duration-150 ease-in-out hover:bg-red-400 active:scale-95 active:shadow-lg"
        >
          Delete
        </Button>
        <Button
          onClick={() => {
            if (data.length != 0) {
              setOpenPayType(true);
            }
          }}
          disabled={data.length == 0}
          className="bg-green-500 px-5 transition duration-150 ease-in-out hover:bg-green-400 active:scale-95 active:shadow-lg"
        >
          {loading ? (
            <Loading
              type="spin"
              color="white"
              height={20}
              width={20}
              className="mx-3"
            />
          ) : (
            "Pay"
          )}
        </Button>
      </div>
      {/* dialog pay type */}
      <Dialog open={openPayType} onOpenChange={setOpenPayType}>
        <DialogContent className="sm:max-w-[400px]">
          <p className="h-auto overflow-visible text-center text-xl font-semibold">
            Please choose a payment method
          </p>
          <DialogFooter>
            <div className="mt-1 flex w-full justify-center gap-4">
              <Button
                onClick={() => addBill(1)}
                className="bg-blue-400 transition duration-150 ease-in-out hover:bg-blue-300 active:scale-95 active:shadow-lg"
              >
                {loading ? (
                  <Loading
                    type="spin"
                    color="white"
                    height={20}
                    width={20}
                    className="mx-3"
                  />
                ) : (
                  "Bank Transfer"
                )}
              </Button>
              <Button
                onClick={() => addBill(2)}
                className="bg-green-500 px-5 transition duration-150 ease-in-out hover:bg-green-400 active:scale-95 active:shadow-lg"
              >
                {loading ? (
                  <Loading
                    type="spin"
                    color="white"
                    height={20}
                    width={20}
                    className="mx-3"
                  />
                ) : (
                  "Cash"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* dialog bill */}
      <Dialog open={openBill} onOpenChange={setOpenBill}>
        <DialogContent className="px-3 sm:max-w-[470px]">
          <div className="h-auto overflow-visible">
            <ScrollArea className="h-[80vh]">
              <div className="dialog-content-to-pdf overflow-visible px-3 pb-2">
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
                    Mã HĐ: {idBill}
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
                    <p>{customer ? customer.customerName : "Khách vãng lai"}</p>
                  </div>
                  <div className="flex justify-between font-roboto_regular text-base text-[#6A6A6A]">
                    <p>Nhân viên lập hóa đơn</p>
                    <p>{user?.staffName}</p>
                  </div>
                  <div className="flex justify-between font-roboto_regular text-base text-[#6A6A6A]">
                    <p>Phương thức thanh toán</p>
                    <p>{payType}</p>
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
                      {data.map((item, index) => (
                        <tr key={index}>
                          <td className="border-b border-dashed border-gray-300 p-2">
                            {item.ProductName}
                          </td>
                          <td className="border-b border-dashed border-gray-300 p-2 text-center">
                            {item.Quantity}
                          </td>
                          <td className="border-b border-dashed border-gray-300 p-2 text-center">
                            {item.Price.toLocaleString("vi-VN")}
                          </td>
                          <td className="border-b border-dashed border-gray-300 p-2 text-center">
                            {item.Total.toLocaleString("vi-VN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mb-2 ml-auto mr-3 mt-2 flex flex-row justify-end gap-4 font-roboto_regular text-base">
                  <div>
                    <p className="text-end">Tổng : </p>
                    {customer?.customerType && (
                      <h2 className="text-end">
                        Thành viên {customer.customerType?.customerTypeName} -
                        {customer.customerType?.discountValue}% :{" "}
                      </h2>
                    )}
                    {voucher && (
                      <h2 className="text-end">
                        Voucher{" "}
                        {voucher.voucherType.voucherTypeID == 2
                          ? `-${voucher.voucherValue}`
                          : `-${voucher.voucherValue}%`}{" "}
                        :
                      </h2>
                    )}
                    <h2 className="mt-1 pt-1 text-end font-semibold">
                      Thành tiền :
                    </h2>
                  </div>
                  <div className="min-w-[100px]">
                    <p className="text-end">
                      {total.toLocaleString("vi-VN")} đ
                    </p>
                    {customer?.customerType && (
                      <p className="text-end">
                        -{" "}
                        {(
                          (total * customer.customerType?.discountValue) /
                          100
                        ).toLocaleString("vi-VN")}{" "}
                        đ
                      </p>
                    )}
                    {voucher?.voucherType.voucherTypeID == 1 && (
                      <p className="text-end">
                        -{" "}
                        {((total * voucher.voucherValue) / 100).toLocaleString(
                          "vi-VN",
                        )}{" "}
                        đ
                      </p>
                    )}
                    {voucher?.voucherType.voucherTypeID == 2 && (
                      <p className="text-end">
                        - {voucher.voucherValue.toLocaleString("vi-VN")} đ
                      </p>
                    )}
                    <p className="mt-1 border-t border-gray-600 pt-[2px] text-end text-lg font-semibold">
                      {totalBill.toLocaleString("vi-VN")} đ
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button className="mr-3" onClick={handleGenerateImg} type="submit">
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
