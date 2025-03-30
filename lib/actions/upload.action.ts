"use server";

import { authenticatedFetch } from "@/lib/auth";
import { ApiLoggerDecorator } from "../decorator/apiLogger";

export const uploadImage = async (formData: FormData) => {
  if (!formData.get("file")) {
    return null;
  }

  const uploadResponse = await authenticatedFetch(
    `${process.env.BASE_URL}/upload`,
    { method: "POST", body: formData },
  );
  return uploadResponse.json();
};

const uploadImageDecorator = new ApiLoggerDecorator(uploadImage).execute;