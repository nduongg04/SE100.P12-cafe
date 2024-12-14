"use client";

import { Button } from "@/components/ui/button";
import { PenSquare, Shapes, Trash2, TriangleAlert, CheckCheck,Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";

export default function TableCardMenu({
  table,
  bookTable,
  unBooked,
}: {
  table: Table;
  bookTable: () => void;
  unBooked: () => void;
}) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 shadow-md">
      <div className="relative h-48">
        <Image
          src="/assets/icons/table.svg"
          alt="table"
          fill={true}
          className="object-contain"
        />
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {table.status == "Not booked" && (
            <Button
              size="sm"
              variant="secondary"
              className="mr-2 bg-[#00B074] text-white hover:bg-[#00956A]"
              onClick={bookTable}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Booked
            </Button>
          )}
          {table.status == "Booked" && (
            <Button
              size="sm"
              variant="secondary"
              onClick={unBooked}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            <Ban className="mr-2 h-4 w-4" />
            Not Booked
          </Button>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {table.tableType.tableNameType}
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold">
          #{table.tableNumber}
          {table.status == "Not booked" ? (
            <span className="ml-2 text-green-500">{table.status}</span>
          ) : table.status == "Booked" ? (
            <span className="ml-2 text-red-500">{table.status}</span>
          ) : (
            <span className="ml-2 text-yellow-500">{table.status}</span>
          )}{" "}
        </h3>
      </CardContent>
    </Card>
  );
}
