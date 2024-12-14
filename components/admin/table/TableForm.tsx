import ImageUploader from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { table } from "console";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const tableFormSchema = z.object({
  tableNumber: z.number().min(0, {
    message: "Must be a positive number.",
  }),
  floorId: z.number().min(0, {
    message: "Price must be a positive number.",
  }),
  tableTypeID: z.number().min(0, {
    message: "Table Type must be a positive number.",
  }),
});

export default function TableForm({
  table,
  tables,
  floors,
  tableTypes,
  onSubmit,
  onCancel,
  isLoading,
}: {
  table?: Table;
  tables: Table[];
  floors: Floor[];
  tableTypes: TableType[];
  onSubmit: (table: z.infer<typeof tableFormSchema>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}) {
  const form = useForm<z.infer<typeof tableFormSchema>>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: {
      tableNumber: table?.tableNumber ?? 1,
      floorId: table?.floor.floorNumber ?? 1,
      tableTypeID: table?.tableTypeID ?? 1,
    },
  });

  function onSubmitForm(values: z.infer<typeof tableFormSchema>) {
    const checkTable = table;
    let check = false;
    tables?.forEach((table) => {
      if (table.tableNumber === values.tableNumber) {
        if (checkTable?.tableID == table.tableID) return;
        form.setError("tableNumber", {
          message: "Table number already exists.",
        });
        check = true;
      }
    });
    if (!check) onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-8">
        <FormField
          disabled={isLoading}
          control={form.control}
          name="tableNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Table number</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter table number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading}
          control={form.control}
          name="tableTypeID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of seats</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value, 10))}
                defaultValue={field.value.toString()}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select no seats" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tableTypes.map((tableType) => (
                    <SelectItem
                      key={tableType.tableTypeID}
                      value={tableType.tableTypeID.toString()}
                    >
                      {tableType.tableNameType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading}
          control={form.control}
          name="floorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Floor</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value, 10))}
                defaultValue={field.value.toString()}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a floor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {floors.map((floor) => (
                    <SelectItem
                      key={floor.floorID}
                      value={floor.floorNumber.toString()}
                    >
                      {floor.floorNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button
            disabled={isLoading}
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
