import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  SortingState,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import React, { useEffect, useRef, useState } from "react";
import { Trash2, Plus, Minus, SearchCheck, CircleX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCustomerData } from "../customer/fetchingData";
import { Customer } from "../customer/columns";
import { searchVoucherByCode, updateTableStatus } from "./fetchingData";
import { toast } from "sonner";
import Loading from "react-loading";
import { getCookies } from "@/lib/action";
import { User } from "@/app/login/page";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type Props = {
  data: PrdBill[];
  setData: React.Dispatch<React.SetStateAction<PrdBill[]>>;
  tableOrder: number | null;
  updateStatus: (tableId:number,status:string) => void;
  resetData: () => void;
};
export default function BillTable({ data, setData, tableOrder,updateStatus,resetData }: Props) {
  const url = process.env.BASE_URL;
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [listCustomer, setListCustomer] = useState<Customer[]>([]);
  const [voucher, setVoucher] = useState<VoucherApi | null>(null);
  const [searchVoucher, setSearchVoucher] = useState<string>("");
  const [searchCustomer, setSearchCustomer] = useState<string>("");
  const [loadingVoucher, setLoadingVoucher] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [totalBill, setTotalBill] = useState<number>(0);
  const [idBill, setIdBill] = useState<number>(0);
  const [payType, setPayType] = useState<string>("Chuyển khoản");
  const [openBill, setOpenBill] = useState<boolean>(false);
  const [openPayType, setOpenPayType] = useState<boolean>(false);
  const [loading,setLoading]= useState(false);
  const [finishedBill,setFinishedBill]= useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      const cookies = await getCookies("user");
      if (cookies?.value) {
        setUser(JSON.parse(cookies.value));
      }
      const datas = await getCustomerData();
      setListCustomer(datas);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const total = data.reduce((acc, item) => acc + item.Total, 0);
    setTotal(total);
    let totalBill = total;
    if (customer?.customerType) {
      totalBill = total - (total * customer.customerType.discountValue) / 100;
    }
    if (voucher) {
      if (voucher.voucherType.voucherTypeID == 1) {
        totalBill = totalBill - (totalBill * voucher.voucherValue) / 100;
      } else if (voucher.voucherType.voucherTypeID == 2) {
        totalBill = totalBill - voucher.voucherValue;
      }
      if (totalBill < 0) {
        totalBill = 0;
      }
    }
    setTotalBill(totalBill);
  }, [customer, voucher, data]);
  useEffect(() => {
    if(finishedBill && !openBill){
      resetData();
      resetBill();
      setFinishedBill(false);
    }
  }, [finishedBill,openBill]);
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
    resetData();
  };
  const handleUpdateTableStatus = async (tableId:number,status:string) => {
    const result = await updateTableStatus(tableId,status);
    if(result){
      updateStatus(tableId,status);
      toast.success("Update table status successfully");
    }
  }   
  const addBill = async (payType: number) => {
    if (payType == 1) {
      setPayType("Chuyển khoản");
    } else {
      setPayType("Tiền mặt");
    }
    if(data.length!=0){
      setOpenPayType(false)
    setLoading(true)
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
      const response = await fetch(`${url}/bill/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staffId: user?.staffId,
          status: "Pending",
          totalPrice: totalBill,
          customerId: customer?.customerId,
          voucherId: voucher?.voucherID,
          payTypeId: payType,
          billDetails: billDetails,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      } else {
        if(tableOrder){
          await handleUpdateTableStatus(tableOrder, "Booked");
        }
        setIdBill(data.data.billId);
        setOpenBill(true);
        setFinishedBill(true);
      }
    } catch (e) {
      toast.error("Failed to add customer: " + e);
    }
    setLoading(false)
  }
  };
  const handleDelete = (id: number) => {
    setData((prevList) => prevList.filter((item) => item.ProductId !== id));
  };
  const handleQuantityChange = (index: number, quantity: number) => {
    const updateList = [...data];
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
  const handleSearchCustomer = () => {
    const find = listCustomer.find(
      (item) =>
        item.phoneNumber === searchCustomer || item.email === searchCustomer,
    );
    if (!find) {
      toast.error("Customer is not found");
      return;
    } else {
      setCustomer(find as Customer);
    }
  };
  const handleSearchVoucher = async () => {
    setLoadingVoucher(true);
    const find = await searchVoucherByCode(searchVoucher);
    if (find) {
      setVoucher(find as VoucherApi);
    }
    setLoadingVoucher(false);
  };
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
      accessorFn: (_, index) => index + 1, // Tự động đánh số thứ tự
      cell: ({ getValue }) => {getValue()}, // Hiển thị số thứ tự
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
            {/* <Button
                        variant='ghost'
                        onClick={()=>handleSubtract(row.index)}>
                            <Minus/>
                        </Button> */}
            <Input
              type="number"
              min={1}
              value={value}
              onChange={(e) => handleChange(e)}
              className="w-16"
            />
            {/* <Button 
                    variant='ghost'
                    onClick={()=>handleAdd(row.index)}>
                    <Plus/>
                    </Button> */}
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
    <div className="ml-2 mt-2 h-[98%] rounded-lg bg-white px-3 pt-3 shadow-sm">
      <div className="flex justify-between">
        <div className="flex items-center">
          <h2>Khách hàng :</h2>
          {customer ? (
            <>
              <p className="ml-2 border-b border-gray-400 font-semibold">
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
                className="ml-3 h-8 w-[8.5rem]"
              />
              <Button
                variant="ghost"
                className="ml-2 p-1"
                onClick={handleSearchCustomer}
              >
                <SearchCheck color="gray" />
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center">
          <h2>Voucher :</h2>
          {voucher ? (
            <>
              <p className="ml-2 border-b border-gray-400 font-semibold">
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
                className="ml-3 h-8 w-[8.5rem]"
              />
              {loadingVoucher ? (
                <Loading
                  type="spin"
                  color="gray"
                  height={20}
                  width={20}
                  className="ml-5"
                />
              ) : (
                <Button
                  variant="ghost"
                  className="ml-2 p-1"
                  onClick={handleSearchVoucher}
                >
                  <SearchCheck color="gray" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      <ScrollArea className="mt-4 h-[420px] rounded-md border-2 border-gray-400 pb-1">
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
      <div className="absolute bottom-6 right-6 mr-3 flex justify-end gap-2">
        <Button
          onClick={resetBill}
          className="bg-red-500 transition duration-150 ease-in-out hover:bg-red-300 active:scale-95 active:shadow-lg"
        >
          Kết thúc
        </Button>
        {/* <Button
          onClick={() => addBill(1)}
          className="bg-blue-400 transition duration-150 ease-in-out hover:bg-blue-300 active:scale-95 active:shadow-lg"
        >
          {loading?
            <Loading
             type="spin"
             color="white"
             height={20}
             width={20}
             className="mx-3"
           />:
          "Thanh toán"}
        </Button> */}
        <Button
          onClick={() => {if(data.length!=0){setOpenPayType(true)}}}
          className="bg-green-500 transition duration-150 ease-in-out hover:bg-green-400 active:scale-95 active:shadow-lg"
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
            "Thanh toán"
          )}
        </Button>
      </div>
      {/* dialog pay type */}
      <Dialog open={openPayType} onOpenChange={setOpenPayType}>
        <DialogContent className="sm:max-w-[400px]">
          <p className="h-auto overflow-visible text-center text-xl font-semibold">
            Chọn phương thức thanh toán
          </p>
          <DialogFooter >
            <div className="flex justify-center gap-4 w-full mt-1">

              <Button
          onClick={() => addBill(1)}
          className="bg-blue-400 transition duration-150 ease-in-out hover:bg-blue-300 active:scale-95 active:shadow-lg"
        >
          {loading?
            <Loading
             type="spin"
             color="white"
             height={20}
             width={20}
             className="mx-3"
           />:
          "Chuyển khoản"}
        </Button>
            <Button
              onClick={() => addBill(2)}
              className="bg-green-500 transition duration-150 ease-in-out hover:bg-green-400 active:scale-95 active:shadow-lg"
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
                "Tiền mặt"
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
