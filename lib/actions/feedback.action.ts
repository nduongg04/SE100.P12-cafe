"use server";

import { Feedback, FeedbackFormData } from "@/types/feedback";
import { authenticatedFetch } from "../auth";

const BASE_URL = process.env.BASE_URL;

export async function getAllFeedback(): Promise<Feedback[]> {
  const res = await authenticatedFetch(`${BASE_URL}/feedback/getall`);
  if (!res.ok) {
    throw new Error("Failed to fetch feedback");
  }
  return await res.json();
}

export async function createFeedback(feedback: FeedbackFormData) {
  const res = await authenticatedFetch(`${BASE_URL}/feedback/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(feedback),
  });

  if (!res.ok) {
    throw new Error("Failed to create feedback");
  }

  return res.json();
}
