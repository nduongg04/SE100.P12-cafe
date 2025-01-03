'use client'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Ban, Check, ChevronsUpDown, Type } from "lucide-react"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { getProductData, getCategoryData, updateProductSoldOut } from './fetchingData'

import { ScrollArea } from '@/components/ui/scroll-area'
import Loading from 'react-loading'
import { CheckCheck } from 'lucide-react'
import { toast } from 'sonner'

export type Product = {
    ProductId: number,
    ProductName: string,
    Price: number,
    Image: string,
    IsSoldOut: boolean,
    CategoryName: string
}
export type Category = {
    CategoryID: number,
    CategoryName: string
}
export type PrdBill = {
    ProductId: number,
    ProductName: string,
    Price: number,
    Quantity: number,
    Total: number,
}
type Props = {
    listPrdBill: PrdBill[]
    setListPrdBill: React.Dispatch<React.SetStateAction<PrdBill[]>>,
    productsData: Product[],
    categoriesData: Category[],
    loading: boolean,
    soldOut: (id:number,isSoldOut:boolean)=>void
}
export default function MenuOrder({ listPrdBill, setListPrdBill, productsData, categoriesData, loading,soldOut }: Props) {
    const [searchPrd, setSearchPrd] = React.useState('');
    const [open, setOpen] = React.useState(false)
    const [typeCate, setTypeCate] = React.useState("All")
    const [categories, setCategories] = React.useState<Category[]>(categoriesData)
    const [products, setProducts] = React.useState<Product[]>(productsData)
    const [listPrd, setListPrd] = React.useState<Product[]>(productsData)
    const [rightClick, setRightClick] = React.useState<number>(-1);
    const setCheckRightClick = (id:number)=>{
        if(rightClick == id){
            setRightClick(-1)
        }else{
            setRightClick(id)
        }
    }
    const updateSoldOut = async (id:number,isSoldOut:boolean)=>{
        const res = await updateProductSoldOut(id,!isSoldOut)
        if(res){  
            soldOut(id,!isSoldOut)
            toast.success("Update product sold out successfully")
        }
        setRightClick(-1)
    }

    useEffect(()=>{
        setCategories(categoriesData)
        setProducts(productsData)
        setListPrd(productsData)
    },[productsData,categoriesData])
    const formatted = (amount: number) => new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "VND",
    }).format(amount)
    const clickPrd = (prd: Product) => {

        if (prd.IsSoldOut) {
            return;
        }
        const updatedList = [...listPrdBill];
        let check = false;
        for (let i = 0; i < updatedList.length; i++) {
            if (updatedList[i].ProductId == prd.ProductId) {
                console.log('click')
                updatedList[i] = {
                    ...updatedList[i],
                    Quantity: updatedList[i].Quantity + 1,
                    Total: prd.Price * (updatedList[i].Quantity + 1),
                };
                setListPrdBill(updatedList)
                check = true;
                break;
            }
        }
        if (!check) {

            updatedList.push({
                ProductId: prd.ProductId,
                ProductName: prd.ProductName,
                Price: prd.Price,
                Quantity: 1,
                Total: prd.Price,
            })
            setListPrdBill(updatedList)

        }
    }
    
    const filterPrd = (name:string,type:string)=>{
        setSearchPrd(name)
        setTypeCate(type)
        let list = products;
        if(name!=""){
            list = list.filter((prd) => prd.ProductName.toLowerCase().includes(name.toLowerCase()))
        }
        if(type!="All"){
            list = list.filter((prd) => String(prd.CategoryName) == type)
        }
        setListPrd(list)
    }

    return (
      <div className="mr-2 mt-2 h-full rounded-lg bg-white px-2 py-2 shadow-sm">
        <div className="mt-2 flex justify-between px-3">
          <Input
            placeholder="Search by name"
            value={searchPrd}
            onChange={(a) => filterPrd(a.target.value, typeCate)}
            className="max-w-xs rounded-md bg-white"
          />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[180px] justify-between"
              >
                {typeCate != "All"
                  ? categories.find(
                      (category) => String(category.CategoryName) === typeCate,
                    )?.CategoryName
                  : "All"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search category..." />
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem
                        key={category.CategoryName}
                        value={String(category.CategoryName)}
                        onSelect={(currentValue: string) => {
                          if (currentValue === typeCate) {
                            filterPrd(searchPrd, "All");
                          } else {
                            filterPrd(searchPrd, currentValue);
                          }
                          setTypeCate(
                            currentValue === typeCate ? "All" : currentValue,
                          );
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            typeCate === String(category.CategoryName)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {category.CategoryName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        {loading ? (
          <div className="mt-3 flex h-[78vh] items-center justify-center">
            <Loading
              type="spin"
              color="gray"
              height={30}
              width={30}
              className="ml-5"
            />
          </div>
        ) : (
          <ScrollArea className="mt-3 h-[78vh] pb-1">
            <div className="grid h-full grid-cols-1 gap-4 px-4 py-2 xl:grid-cols-3">
              {listPrd.map((prd) => {
                return prd.IsSoldOut ? (
                  <div
                    key={prd.ProductId}
                    onContextMenu={(e) => {
                      e.preventDefault(); // Ngăn chặn menu ngữ cảnh mặc định
                      setCheckRightClick(prd.ProductId);
                      console.log(`Right click on ${prd.ProductName}`);
                    }}
                    className="relative flex flex-col justify-between rounded-lg border p-3 px-1 text-center shadow-md"
                  >
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg border bg-gray-500 bg-opacity-70">
                      {rightClick == prd.ProductId ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="mr-2 bg-[#00B074] text-white hover:bg-[#00956A]"
                          onClick={() =>
                            updateSoldOut(prd.ProductId, prd.IsSoldOut)
                          }
                        >
                          <CheckCheck className="mr-2 h-4 w-4" />
                          Available
                        </Button>
                      ) : (
                        <span className="text-lg font-semibold text-red-600">
                          Sold out
                        </span>
                      )}
                    </div>
                    <img
                      src={prd.Image}
                      alt="Product Image"
                      className="mb-2 h-32 w-full rounded-md object-contain"
                    />
                    <div>
                      <h2 className="flex h-9 items-center justify-center overflow-y-hidden text-ellipsis text-sm font-semibold">
                        {prd.ProductName}
                      </h2>
                      <p className="text-gray-700">{formatted(prd.Price)}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    key={prd.ProductId}
                    className="relative flex cursor-pointer flex-col justify-between rounded-lg border p-3 px-1 text-center shadow-md transition duration-150 ease-in-out hover:bg-gray-100 active:scale-95 active:shadow-lg"
                    onClick={() => {
                      if (rightClick != prd.ProductId) {
                        clickPrd(prd);
                      }
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault(); // Ngăn chặn menu ngữ cảnh mặc định
                      setCheckRightClick(prd.ProductId);
                    }}
                  >
                    {rightClick == prd.ProductId && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg border bg-gray-500 bg-opacity-70">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            updateSoldOut(prd.ProductId, prd.IsSoldOut)
                          }
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Sold out
                        </Button>
                      </div>
                    )}
                    <img
                      src={prd.Image}
                      alt="Product Image"
                      className="mb-2 h-32 w-full rounded-md object-contain"
                    />
                    <div>
                      <h2 className="flex h-9 items-center justify-center overflow-y-hidden text-ellipsis text-sm font-semibold">
                        {prd.ProductName}
                      </h2>
                      <p className="text-gray-700">{formatted(prd.Price)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    );
}