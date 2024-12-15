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
import { getCategoryData, getProductData, unBookedTable, updateTableStatus } from "./fetchingData";
import { toast } from "sonner";
import Loading from "react-loading";
import { Category, Product } from "./menuOrder";
type Props = {};

export default function OrderPage({}: Props) {
  const [listPrdBill, setListPrdBill] = React.useState<PrdBill[]>([]);
  const [tableOrder, setTableOrder] = React.useState<number|null>(null);
  const [tabDineIn, setTabDineIn] = React.useState<boolean>(false);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const[isLoadingMenu,setIsLoadingMenu]=React.useState<boolean>(true);
  const [tables, setTables] = React.useState<Table[]>([]);
  const [tableNumber, setTableNumber] = React.useState<number|null>(null);
  const [isLoadingUnBooked,setIsLoadingUnbooked]=React.useState<boolean>(false);
  const [isLoadingTable,setIsLoadingTable]=React.useState<boolean>(true);
  
  useEffect(()=>{
    async function fetchData(){
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
  },[])
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
  const updateStatusTable = (tableId:number,status:string) => {
    const updatedTables = tables.map(table => 
        table.tableID === tableId ? { ...table, status } : table
      );
      setTables(updatedTables);
  }
  const handleChooseTable = (tableId:number,tableNumber:number)=>{
    setTableOrder(tableId);
    setTableNumber(tableNumber);
    setTabDineIn(true);
  }
  const handleUpdateTableStatus = async (tableId: number, status: string) => {
    setIsLoadingUnbooked(true);
    const result = await unBookedTable(tableId);
    if (result) {
      updateStatusTable(tableId, status);
      toast.success("Unbooked table successfully");
    } 
    setIsLoadingUnbooked(false);
  };    
  const resetData = ()=>{
    setListPrdBill([]);
    setTableOrder(null);
    setTableNumber(null);
    setTabDineIn(false);
  }
  const updateProductSoldOut = (id:number,isSoldOut:boolean)=>{
    const updatedProducts = products.map(product => 
        product.ProductId === id ? { ...product, IsSoldOut: isSoldOut } : product
      );
      setProducts(updatedProducts);
  }
  return (
    //
    <Tabs defaultValue="Dine-in" className="mx-2 mt-2">
      <div className="relative flex items-center justify-between">
        <TabsList className="grid w-[30%] grid-cols-2">
          <TabsTrigger
            onClick={() => {
              resetData();
            }}
            value="Dine-in"
            className="flex items-start justify-start p-2 text-center text-xl font-semibold"
          >
            <p className="w-full text-center">Dine-in</p>
          </TabsTrigger>
          <TabsTrigger
            onClick={() => {
              resetData();
            }}
            value="Take-away"
            className="items-start justify-start p-2 text-xl font-semibold"
          >
            <p className="w-full text-center">Take-away</p>
          </TabsTrigger>
        </TabsList>
        {tableOrder && tableNumber && (
          <p className="absolute right-1 top-7 text-xl font-semibold">
            Bàn #{tableNumber}
          </p>
        )}
      </div>

      <TabsContent value="Dine-in">
        {tabDineIn ? (
          <div className="mt-2 flex">
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
              ></BillTable>
            </div>
          </div>
        ) : (
          <div className="mt-5 h-full relative ">
            {isLoadingUnBooked && (
              <div className=" rounded-lg absolute inset-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
                <Loading type="spin" color="#fff" height={40} width={40} />
              </div>
            )}
            <TableOrder
              setTableOrder={handleChooseTable}
              tables={tables}
              isFetching={isLoadingTable}
              updateStatus={handleUpdateTableStatus}
            />
          </div>
        )}
      </TabsContent>
      <TabsContent value="Take-away">
        <div className="mt-2 flex">
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
              resetData={resetData}
              data={listPrdBill}
              setData={setListPrdBill}
              tableOrder={null}
              updateStatus={updateStatusTable}
            ></BillTable>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
