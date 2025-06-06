import { feedbackSubject } from "@/components/ui/observer/notificationObserver";
import { getAllFeedback } from "@/lib/actions/feedback.action";
import { useEffect } from "react";

export class RealtimeService {
  private static instance: RealtimeService;
  private feedbackPolling: NodeJS.Timeout | null = null;

  static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService();
    }
    return RealtimeService.instance;
  }

  // Trigger cho feedback
  async triggerFeedbackUpdate() {
    const data = await getAllFeedback();
    feedbackSubject.notifyObservers(JSON.stringify(data));
  }

  // Bắt đầu polling
  startFeedbackPolling(intervalMs = 30000) {
    this.feedbackPolling = setInterval(() => {
      this.triggerFeedbackUpdate();
    }, intervalMs);
  }

  stopFeedbackPolling() {
    if (this.feedbackPolling) {
      clearInterval(this.feedbackPolling);
      this.feedbackPolling = null;
    }
  }
}

export default function useRealtimeUpdates() {
  useEffect(() => {
    const service = RealtimeService.getInstance();

    // Bắt đầu polling
    service.startFeedbackPolling(30000);

    // Cleanup
    return () => {
      service.stopFeedbackPolling();
    };
  }, []);

  // Return function để manual trigger
  return {
    refreshFeedback: () =>
      RealtimeService.getInstance().triggerFeedbackUpdate(),
  };
}
