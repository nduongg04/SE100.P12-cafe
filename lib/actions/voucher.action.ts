"use server";

import { authenticatedFetch } from "../auth";
import { parseDate } from "../utils";
import { ApiLoggerDecorator } from "../decorator/apiLogger";

function turnVoucherApiType(voucher: Voucher): VoucherApi {
  const voucherApi: VoucherApi = {
    voucherID: voucher.id,
    voucherCode: voucher.code,
    voucherValue: voucher.value,
    voucherType: {
      voucherTypeID: voucher.typeName === "Percentage of bill" ? 1 : 2,
      typeName: voucher.typeName,
    },
    maxApply: voucher.numberOfApplications,
    createdDate: voucher.createdAt.toISOString(),
    expiredDate: voucher.expiredAt.toISOString(),
  };
  return voucherApi;
}

function turnVoucherType(voucher: VoucherApi): Voucher {
  const voucherType: Voucher = {
    id: voucher.voucherID,
    code: voucher.voucherCode,
    value: voucher.voucherValue,
    typeName: voucher.voucherType.typeName,
    numberOfApplications: voucher.maxApply,
    createdAt: parseDate(voucher.createdDate),
    expiredAt: parseDate(voucher.expiredDate),
  };
  return voucherType;
}

export async function getAllVouchers(): Promise<Voucher[] | null> {
  try {
    const response = await authenticatedFetch(
      `${process.env.BASE_URL}/voucher/getall`,
      { method: "GET" },
    );
    const data = await response.json();
    return data.map(turnVoucherType);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createVoucher(
  voucher: Omit<Voucher, "id">,
): Promise<Voucher | null> {
  try {
    const createVoucherBody = {
      voucherCode: voucher.code,
      voucherValue: voucher.value,
      voucherTypeId: voucher.typeName === "Percentage of bill" ? 1 : 2,
      maxApply: voucher.numberOfApplications,
      createdDate: voucher.createdAt.toISOString(),
      expiredDate: voucher.expiredAt.toISOString(),
    };
    const response = await authenticatedFetch(
      `${process.env.BASE_URL}/voucher/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createVoucherBody),
      },
    );
    const data = await response.json();
    return turnVoucherType(data);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateVoucher(voucher: Voucher): Promise<Voucher | null> {
  console.log(voucher);

  try {
    const { id, ...rest } = voucher;
    console.log(rest);
    const updateVoucherBody = {
      voucherCode: rest.code,
      voucherValue: rest.value,
      voucherTypeId: rest.typeName === "Percentage of bill" ? 1 : 2,
      maxApply: rest.numberOfApplications,
      createdDate: rest.createdAt.toISOString(),
      expiredDate: rest.expiredAt.toISOString(),
    };
    const response = await authenticatedFetch(
      `${process.env.BASE_URL}/voucher/update/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateVoucherBody),
      },
    );
    const { data } = await response.json();
    const { voucherType, voucherTypeId, ...temp } = data;
    return turnVoucherType({
      ...temp,
      voucherType: {
        voucherTypeID: voucherTypeId,
        typeName:
          voucherTypeId === 1
            ? "Percentage of bill"
            : "Discount directly on invoice",
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function deleteVouchers(ids: number[]) {
  console.log(ids);
  try {
    const response = await authenticatedFetch(
      `${process.env.BASE_URL}/voucher/deleteMany?setOfVoucherId=${ids.join(",")}`,
      { method: "DELETE" },
    );
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const createVoucherDecorator = new ApiLoggerDecorator(createVoucher).execute;
export const updateVoucherDecorator = new ApiLoggerDecorator(updateVoucher).execute;
export const deleteVouchersDecorator = new ApiLoggerDecorator(deleteVouchers).execute;
