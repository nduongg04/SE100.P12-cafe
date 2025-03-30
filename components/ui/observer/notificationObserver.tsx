export interface NotificationObserver {
  update(notification: string): void;
}

export class NotificationSubject {
  private observers: NotificationObserver[] = [];

  registerObserver(observer: NotificationObserver): void {
    this.observers.push(observer);
  }

  removeObserver(observer: NotificationObserver): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notifyObservers(notification: string): void {
    for (const observer of this.observers) {
      observer.update(notification);
    }
  }
}

export const notificationService = new NotificationSubject();
export const feedbackSubject = new NotificationSubject();
export const topDishesSubject = new NotificationSubject();