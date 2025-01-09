export type Feedback = {
  feedbackId?: number;
  starNumber: number;
  email: string;
  phonenumber: string;
  fullname: string;
  content: string;
};

export type FeedbackFormData = Omit<Feedback, "feedbackId"> & {
  listProdFb: {
    productID: number;
    star: number;
  }[];
};
