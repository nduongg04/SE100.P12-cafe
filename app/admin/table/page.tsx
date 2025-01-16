"use client";

import FloorForm, {floorFormSchema} from "@/components/admin/table/FloorForm";
import TableCardMenu from "@/components/admin/table/TableCardMenu";
import TableForm, { tableFormSchema } from "@/components/admin/table/TableForm";
import { Button } from "@/components/ui/button";
import TableTypeButton from "@/components/admin/table/TableTypeButton";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Trash2,
  TriangleAlert,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import {
    getAllFloor,
    getAllTableType,
    addFloor,
    deleteFloor,
  addTable,
  deleteTable,
  getAllTable,
  updateTable,
} from "@/lib/actions/table.action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Tally3, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import * as z from "zod";
import Tooltip from "@/components/custom/toolTip";

export default function Table() {
  const [isAddTableDialogOpen, setIsAddTableDialogOpen] = useState(false);
  const [isAddFloorDialogOpen, setIsAddFloorDialogOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const queryClient = useQueryClient();

  const { data: tables = [] as Table[], isLoading: isFetching } = useQuery<Table[]>({
    queryKey: ["tables"],
    queryFn: async () => {
      const tables = await getAllTable();
      if (!tables) {
        toast({
          title: "Failed to fetch tables",
          description: "Please try again",
          variant: "destructive",
        });
        return [];
      }
      return tables;
    },
  });
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
        (activeCategory === "all" || d.tableType.tableNameType === activeCategory) &&
        d.tableNumber.toString().includes(debouncedSearchTerm.toLowerCase()),
    );
  }, [debouncedSearchTerm, tables, activeCategory]);

  const addMutation = useMutation({
    mutationFn: async (newTable: z.infer<typeof tableFormSchema>) => {
      setIsLoading(true);
      if (typeof window !== 'undefined') {
        const table = (
          await addTable({
            tableNumber: newTable.tableNumber,
            tableTypeID: newTable.tableTypeID,
            floor: {
              floorID: newTable.floorId,
              floorNumber: 1,
              tables: [],
            }
          })
        )?.data;
        if (!table) {
          throw new Error("Failed to add table");
        }
        setIsAddTableDialogOpen(false);
        setIsLoading(false);
        return table;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      toast({
        title: "Success",
        description: "Table added successfully",
        variant: "success",
      });
    },
    onError: () => {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to add table",
        variant: "destructive",
      });
    },
  });
  const floorAddMutation = useMutation({
    mutationFn: async (newFloor: z.infer<typeof floorFormSchema>) => {
      setIsLoading(true);
      if (typeof window !== 'undefined') {
        const floor = (
          await addFloor({
            floorNumber: newFloor.floorNumber,
          })
        )?.data;
        if (!floor) {
          throw new Error("Failed to add floor");
        }
        setIsAddTableDialogOpen(false);
        setIsLoading(false);
        return floor;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors"] });
      toast({
        title: "Success",
        description: "Floor added successfully",
        variant: "success",
      });
    },
    onError: () => {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to add floor",
        variant: "destructive",
      });
    },
  });

  const modifyMutation = useMutation({
    mutationFn: async (updatedTable: z.infer<typeof tableFormSchema>) => {
      setIsLoading(true);
      if (!editingTable) throw new Error("No table selected for editing");
      try {
        const response = await updateTable({
            ...updatedTable,
            tableID: editingTable.tableID,
            tableNumber: updatedTable.tableNumber,
            tableType: editingTable.tableType,
            tableTypeID: updatedTable.tableTypeID,
            floor: {
                floorID: editingTable.floorId,
                floorNumber: editingTable.floor.floorNumber,
                tables: []
            },
            floorId: updatedTable.floorId,
            status: editingTable.status,
            billId: editingTable.billId,
        });
        if(response.message !== "Update successfully")
          throw new Error("Failed to modify table");
        
        setIsLoading(false);
        setEditingTable(null);
        return {
          ...editingTable,
          ...updatedTable,
        };
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      toast({
        title: "Success",
        description: "Table modified successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to modify table",
        variant: "destructive",
      });
    },
  });

  const floorModifyMutation = useMutation({
    mutationFn: async (floorID: number) => {
      const message = await deleteFloor(floorID);
      if (!message) {
        throw new Error("Failed to delete floor");
      }
      return message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors"] });
      toast({
        title: "Success",
        description: "Floor deleted successfully",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete floor",
        variant: "destructive",
      });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (tableID: number) => {
      const message = await deleteTable(tableID);
      if (!message) {
        throw new Error("Failed to delete table");
      }
      return message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      toast({
        title: "Success",
        description: "Table deleted successfully",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete table",
        variant: "destructive",
      });
    },
  });
  const floorDeleteMutation = useMutation({
    mutationFn: async (floorID: number) => {
      tables.forEach((table) => {
        if (table.floor.floorID === floorID) {
          throw new Error("Cannot delete floor with tables in it");
        }
      });
      const message = await deleteFloor(floorID);
      if (!message) {
        throw new Error("Failed to delete floor");
      }
      return message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors"] });
      toast({
        title: "Success",
        description: "Floor deleted successfully",
        variant: "success",
      });
    },
    onError: (e) => {
      toast({
        title: "Error",
        description: e.message || "Failed to delete floor",
        variant: "destructive",
      });
    },
  });
  return (
    <div className="mx-auto w-full max-w-7xl space-y-12 p-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Table management</h1>
      </div>
      <div className="flex flex-col xl:flex-row xl:space-y-0 justify-between gap-4" >
        <div className="flex flex-wrap justify-center gap-2 xl:justify-start">
          <TableTypeButton
            tableType={{ tableTypeID: 0, tableNameType: "All"}}
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
        <div className="relative flex-1 xl:w-auto">
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
        <div>
          <Dialog
          open={isAddFloorDialogOpen}
          onOpenChange={setIsAddFloorDialogOpen}
          >
          <DialogTrigger asChild>
              <Button className="bg-[#00B074] text-white hover:bg-[#00956A] mr-4 mb-2 min-[416px]:mb-0">
              <Plus className="mr-2 h-4 w-4" />
              Add New Floor
              </Button>
          </DialogTrigger>
          <DialogContent>
              <DialogHeader>
              <DialogTitle>Add New Floor</DialogTitle>
              </DialogHeader>
              <FloorForm
              floors={floors}
              isLoading={isLoading}
              onSubmit={floorAddMutation.mutate}
              onCancel={() => setIsAddTableDialogOpen(false)}
              />
          </DialogContent>
          </Dialog>

          <Dialog
          open={isAddTableDialogOpen}
          onOpenChange={setIsAddTableDialogOpen}
      >
          <DialogTrigger asChild>
              <Button className="bg-[#00B074] text-white hover:bg-[#00956A]">
              <Plus className="mr-2 h-4 w-4" />
              Add New Table
              </Button>
          </DialogTrigger>
          <DialogContent>
          <DialogHeader>
              <DialogTitle>Add New Table</DialogTitle>
          </DialogHeader>
          <TableForm
              tables={tables}
              tableTypes={tableTypes}
              isLoading={isLoading}
              floors={floors}
              onSubmit={addMutation.mutate}
              onCancel={() => setIsAddTableDialogOpen(false)}
          />
          </DialogContent>
          </Dialog>
        </div>
      </div>
        {floors.map((floor) => (
            <div key={floor.floorID}>
              <div className="flex flex-row mb-4">
                <p className="text-2xl font-semibold text-gray-900">
                  Floor {floor.floorNumber}
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Trash2 className="h-4 w-4 text-red-500 cursor-pointer mt-1 ml-1" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader className="flex flex-col items-center">
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <TriangleAlert className="size-20 text-[#ff0000]" />
                      Are you sure you want to delete the floor {floor.floorNumber}?
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-green-600 hover:bg-green-500"
                        onClick={() => floorDeleteMutation.mutate(floor.floorID)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
                
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredTables.filter((table)=>table.floor.floorID==floor.floorID).map((table) => (
                    <TableCardMenu
                        key={table.tableID}
                        table={table}
                        onModify={() => setEditingTable(table)}
                        onDelete={() => deleteMutation.mutate(table.tableID)}
                    />
                    ))}
                </div>
            </div>
        ))}
      {isFetching ? (
        <div className="flex items-center justify-center">
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
        <div className="py-12 text-center">
          <h3 className="mb-2 text-2xl font-semibold text-gray-700">
            No tables found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or floor filter.
          </p>
        </div>
      ) : null}

      <Dialog
        open={!!editingTable}
        onOpenChange={(open) => !open && setEditingTable(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modify Table</DialogTitle>
          </DialogHeader>
          {editingTable && (
            <TableForm
              tables={tables}
              tableTypes={tableTypes}
              isLoading={isLoading}
              table={editingTable}
              floors={floors}
              onSubmit={modifyMutation.mutate}
              onCancel={() => setEditingTable(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
