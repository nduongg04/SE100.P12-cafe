"use client";
import TableTypeButton from "@/components/admin/table/TableTypeButton";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  getAllFloor,
  getAllTableType,
} from "@/lib/actions/table.action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Tally3, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import TableCardOrder from "@/components/employee/order/tableCardOrder";
import { ScrollArea } from "@/components/ui/scroll-area";

type props={
  setTableOrder: (tableId: number,tableNumber:number) => void;
  tables:Table[];
  isFetching:boolean;
  updateStatus: (tableId:number,status:string) => void;
  showBill: (tableId:number) => Promise<void>;
}
export default function TableOrder({setTableOrder,tables,isFetching,updateStatus,showBill}:props) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: floors = [] as Floor[] } = useQuery<Floor[]>({
    queryKey: ["floors"],
    queryFn: async () => {
      const floors = await getAllFloor();
      if (!floors) {
        toast({
          title: "Failed to fetch floors",
          description: "Please try again",
          variant: "destructive",
        });
        return [];
      }
      return floors;
    },
  });
  const { data: tableTypes = [] as TableType[] } = useQuery<TableType[]>({
    queryKey: ["tableTypes"],
    queryFn: async () => {
      const tableTypes = await getAllTableType();
      if (!tableTypes) {
        toast({
          title: "Failed to fetch table types",
          description: "Please try again",
          variant: "destructive",
        });
        return [];
      }
      return tableTypes;
    },
  });

  const filteredTables = useMemo(() => {
    return tables.filter(
      (d) =>
        (activeCategory === "all" ||
          d.tableType.tableNameType === activeCategory) &&
        d.tableNumber.toString().includes(debouncedSearchTerm.toLowerCase()),
    );
  }, [debouncedSearchTerm, tables, activeCategory]);

  return (
    <div className="mx-auto h-full w-full rounded-lg border border-gray-200 bg-white pt-4 shadow-md">
      <div className="flex flex-col gap-4 px-4 pb-4 shadow-sm xl:flex-row xl:space-y-0">
        <div className="flex flex-wrap items-center justify-center gap-2 xl:justify-start">
          <TableTypeButton
            tableType={{ tableTypeID: 0, tableNameType: "All" }}
            isActive={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          />
          {tableTypes.map((tableType) => (
            <TableTypeButton
              key={tableType.tableTypeID}
              tableType={tableType}
              isActive={activeCategory === tableType.tableNameType}
              onClick={() => setActiveCategory(tableType.tableNameType)}
            />
          ))}
        </div>
        <div className="relative xl:w-[300px]">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <Input
            type="text"
            placeholder="Search table id"
            className="w-64 border-gray-300 py-2 pl-10 pr-4 focus:border-[#00B074] focus:ring-[#00B074] lg:w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {tables.length != 0 && (
        <ScrollArea className="h-[66vh] overflow-y-auto px-4 md:h-[72vh] xl:h-[80vh]">
          {floors.map((floor) => (
            <div key={floor.floorID}>
              <div className="mb-4 mt-2 flex flex-row">
                <p className="text-2xl font-semibold text-gray-900">
                  Floor {floor.floorNumber}
                </p>
              </div>

              <div className="mb-4 mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTables
                  .filter((table) => table.floor.floorID == floor.floorID)
                  .map((table) => (
                    <TableCardOrder
                      key={table.tableID}
                      table={table}
                      bookTable={() =>
                        setTableOrder(table.tableID, table.tableNumber)
                      }
                      unBooked={() => updateStatus(table.tableID, "Not booked")}
                      repairTable={() =>
                        updateStatus(table.tableID, "Under repair")
                      }
                      repairedTable={() =>
                        updateStatus(table.tableID, "Repaired")
                      }
                      showBill={() => showBill(table.tableID)}
                    />
                  ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      )}
      {isFetching ? (
        <div className="flex h-[66vh] items-center justify-center md:h-[72vh] xl:h-[80vh]">
          <svg
            aria-hidden="true"
            className="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      ) : tables.length === 0 ? (
        <div className="h-[66vh] py-12 text-center md:h-[72vh] xl:h-[80vh]">
          <h3 className="mb-2 text-2xl font-semibold text-gray-700">
            No tables found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or floor filter.
          </p>
        </div>
      ) : null}
    </div>
  );
}
