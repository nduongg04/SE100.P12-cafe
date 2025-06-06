"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import type { Feedback } from "@/types/feedback";
import LoadingSpinner from "./LoadingSpinner";
import { feedbackSubject } from "../ui/observer/notificationObserver";
import useRealtimeUpdates from "@/hooks/use-realtime-updates";

type FeedbackDisplayProps = {
  isLoading: boolean;
  customerReviews?: Feedback[];
};

export function FeedbackDisplay({
  isLoading,
  customerReviews = [],
}: FeedbackDisplayProps) {
  const [customerReviewsObserver, setCustomerReviewsObserver] =
    useState<Feedback[]>(customerReviews);

  // Sử dụng realtime hook
  const { refreshFeedback } = useRealtimeUpdates();

  useEffect(() => {
    const observer = {
      update: (notification: string) => {
        const reviews: Feedback[] = JSON.parse(notification);
        setCustomerReviewsObserver(reviews);
      },
    };

    feedbackSubject.registerObserver(observer);

    if (customerReviews.length === 0) {
      refreshFeedback();
    }

    return () => feedbackSubject.removeObserver(observer);
  }, [refreshFeedback, customerReviews.length]);

  // Update state khi props thay đổi
  useEffect(() => {
    if (customerReviews.length > 0) {
      setCustomerReviewsObserver(customerReviews);
    }
  }, [customerReviews]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
          <CardDescription>Loading customer feedback...</CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
        <CardDescription>Recent feedback from our customers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {customerReviewsObserver.length === 0 ? (
          <p className="text-center text-gray-500">No feedback available</p>
        ) : (
          customerReviewsObserver.map((feedback) => (
            <div
              key={feedback.feedbackId}
              className="flex items-start space-x-4 rounded-lg bg-gray-50 p-4"
            >
              <Avatar>
                <AvatarFallback>
                  {feedback.fullname
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{feedback.fullname}</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < feedback.starNumber
                            ? "fill-[#00B074] text-[#00B074]"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{feedback.content}</p>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>{feedback.email}</span>
                  <span>{feedback.phonenumber}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
