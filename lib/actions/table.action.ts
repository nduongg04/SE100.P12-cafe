"use server";

import { stat } from "fs";
import { authenticatedFetch } from "../auth";
import { float } from "html2canvas/dist/types/css/property-descriptors/float";

export const getAllFloor = async () => {
  try {
    const response = await authenticatedFetch(
      `${process.env.BASE_URL}/floor/getall`,
      { method: "GET" },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllTable = async () => {
  try {
    const response = await authenticatedFetch(
      `${process.env.BASE_URL}/table/getall`,
      { method: "GET" },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllTableType = async () => {
  try {
    const response = await authenticatedFetch(
      `${process.env.BASE_URL}/tableType/getall`,
      { method: "GET" },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const addTable = async (
  table: Omit<Table, "tableID" | "billId" | "status" | "tableType" | "floorId">,
) => {
  try {
    const response = await authenticatedFetch(
      `${process.env.BASE_URL}/table/create`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          tableNumber: table.tableNumber,
          floorId: table.floor.floorID,
          tableTypeID: table.tableTypeID,
        }),
      },
    );
    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteTable = async (tableID: number) => {
  try {
    const response = await authenticatedFetch(
      `${process.env.BASE_URL}/table/delete/${tableID}`,
      { method: "DELETE" },
    );
    const data = await response.json();
    if (!response.ok) {
      // Throw or return error for non-2xx status
      throw new Error(data.message || "Failed to delete table");
    }
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateTable = async (table: Table) => {
  try {
    console.log("Data: ", table);
    const response = await authenticatedFetch(
      `${process.env.BASE_URL}/table/update/${table.tableID}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          tableNumber: table.tableNumber,
          floorId: table.floorId,
          tableTypeID: table.tableTypeID,
          status: table.status,
        }),
      },
    );
    return response.json();
  } catch (error) {
    return null;
  }
};
export const addFloor = async (floor: Omit<Floor, "floorID" | "tables">) => {
  try {
    const response = await authenticatedFetch(
      `${process.env.BASE_URL}/floor/create`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          floorNumber: floor.floorNumber,
        }),
      },
    );
    if (response.status !== 200) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const deleteFloor = async (floorID: number) => {
  try {
    const response = await authenticatedFetch(
      `${process.env.BASE_URL}/floor/delete/${floorID}`,
      { method: "DELETE" },
    );
    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};
