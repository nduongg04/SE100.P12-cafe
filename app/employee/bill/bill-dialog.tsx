import React, { useState } from 'react';
import { getCookies } from '@/lib/action';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose ,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Fragment } from "react"
  import { toast } from "sonner";
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Bill } from './columns';
import { BillApiAdapter } from '@/lib/apis/billAPI';
const BillDialog = ({bill, onUpdate} : {bill:Bill, onUpdate: (status: "Pending"|"Successful")=>void}) => {
  const billApi = new BillApiAdapter();
  const [initialStatus] = useState(bill.status);
  const [currentStatus, setCurrentStatus] = useState<"Pending"|"Successful">(bill.status);

  const handleSave = async () => {
    if (initialStatus !== currentStatus) {
      try {
        const response = await billApi.updateStatus(bill.id, currentStatus);

        if (!response.ok) {
          toast.error('Failed to update status');
        }
        bill.status = currentStatus;
        onUpdate(currentStatus);
        toast.success("Status updated successfully");
      } catch (error) {
        toast.error('Failed to update status: '+ error);
      }
    } else {
      toast.info('No changes detected');
    }
  };

  return (
    <DialogContent className="sm:max-w-[925px]">
        <DialogHeader>
        <DialogTitle>Edit bill status #{bill.id}</DialogTitle>
        <DialogDescription>
            Make changes to bill status here. Click save when you're done.
        </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 w-[100%]">
        <div className="flex justify-between">
            <Label 
                >Staff: <span className="font-normal">{bill.staff}</span></Label>            
            <Label 
                >Customer: <span className="font-normal">{bill.customer}</span></Label>
            <div className="flex">
                <Label className="mx-4">Status</Label>
                <RadioGroup defaultValue={bill.status} onValueChange={(value) => setCurrentStatus(value as "Pending" | "Successful")}>
                <div className="flex items-center space-x-2 text-red-500">
                    <RadioGroupItem value="Pending" id="r1" />
                    <Label htmlFor="r1">Pending</Label>
                </div>
                <div className="flex items-center space-x-2 text-green-400">
                    <RadioGroupItem value="Successful" id="r2" />
                    <Label htmlFor="r2">Successful</Label>
                </div>                   
                </RadioGroup>              
            </div>
        </div>
        <Label>Product List</Label>
        <div className="overflow-y-auto max-h-48">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead >Total Price</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody >
                {
                bill.billInfo.map((billInfo, index) => (
                    <Fragment key={billInfo.productID}>
                        <TableRow>
                        <TableCell className="text-left">{index + 1}</TableCell>
                        <TableCell>{billInfo.productName}</TableCell>
                        <TableCell>{billInfo.productCount}</TableCell>
                        <TableCell>{billInfo.productPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                                                      <TableCell>{billInfo.totalPriceDtail.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                        </TableRow>
                    </Fragment>
                    ))
                }
            </TableBody>
            </Table>
        </div>
        <div className="flex justify-between">
            <Label>Payment Type: <span className="font-normal">{bill.payType}</span></Label>       
            <Label>Created At: <span className="font-normal">{bill.dateString}</span></Label>   
        </div>
        <Label htmlFor="discount" className="text-orange-500 text-right">Discount: <span>{bill.voucherTypeIndex==2? bill.voucherValue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }):bill.voucherValue}</span> {bill.voucherTypeIndex==2?'':'%'}</Label>
                      <Label htmlFor="totalPrice" className="text-red-600 text-right">Sub Total: <span>{bill.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></Label>
        </div>
        <DialogFooter>
        <DialogClose asChild>
            <Button type="submit" className="bg-green-600 hover:bg-green-500" onClick={handleSave}>Save changes</Button>
          </DialogClose>
        </DialogFooter>
    </DialogContent>
  );
};

export default BillDialog;