"use client";

import { format } from "date-fns";
import { CalendarIcon, Loader } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Voucher } from "@/app/admin/voucher/page";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const formSchema = z
  .object({
    code: z.string().min(2, {
      message: "Code must be at least 2 characters.",
    }),
    typeName: z.enum(["Percentage of bill", "Discount directly on invoice"]),
    numberOfApplications: z.string().refine(
      (v) => {
        let n = Number(v);
        return !isNaN(n) && v?.length > 0;
      },
      { message: "Invalid number" },
    ),
    createdAt: z.date(),
    expiredAt: z.date(),
  })
  .refine((data) => data.expiredAt > data.createdAt, {
    path: ["expiredAt"],
    message: "Expired at must be greater than or equal to created at",
  });

type VoucherFormProps = {
  editOrAdd: "edit" | "add";
  setIsDialogOpen: (isDialogOpen: boolean) => void;
  editingVoucher: Voucher | null;
  handleSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  formMessage?: string;
};

const VoucherForm = ({
  editOrAdd,
  setIsDialogOpen,
  editingVoucher,
  handleSubmit,
  formMessage,
}: VoucherFormProps) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: editingVoucher?.code || "",
      typeName: editingVoucher?.typeName || "Percentage of bill",
      numberOfApplications:
        editingVoucher?.numberOfApplications.toString() || "1",
      createdAt:
        editingVoucher?.createdAt ||
        new Date(new Date().setDate(new Date().getDate() - 1)),
      expiredAt: editingVoucher?.expiredAt || new Date(),
    },
  });

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsExecuting(true);
    await handleSubmit(values);
    setIsExecuting(false);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="grid gap-4 py-4"
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Code</FormLabel>
                  <FormControl>
                    <Input {...field} className="col-span-3" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="typeName"
            render={({ field: { value, onChange, ...rest } }) => (
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Type name</FormLabel>
                  <FormControl>
                    <Select value={value} onValueChange={onChange} {...rest}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Percentage of bill">
                          Percentage of bill
                        </SelectItem>
                        <SelectItem value="Discount directly on invoice">
                          Discount directly on invoice
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numberOfApplications"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">
                    Number of applications
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" className="col-span-3" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="createdAt"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Created at</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`col-span-3 justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expiredAt"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Expired at</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`col-span-3 justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {formMessage !== "" && (
            <FormMessage className="text-red-500">{formMessage}</FormMessage>
          )}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button disabled={isExecuting} type="submit">
              {isExecuting ? (
                <Loader className="animate-spin" />
              ) : editOrAdd === "edit" ? (
                "Save"
              ) : (
                "Add"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default VoucherForm;
