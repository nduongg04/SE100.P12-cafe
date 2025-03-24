import { getAllCustomers } from "../actions/customer.action";

interface CustomerClientInterface {
  getAll(): Promise<Customer[] | null>;
}
class CustomerFacade {
  static async getAll() {
    return await getAllCustomers();
  }
}

export class CustomerApiAdapter implements CustomerClientInterface {
  private customerFacade: typeof CustomerFacade;
  constructor() {
    this.customerFacade = CustomerFacade;
  }
  async getAll(): Promise<Customer[] | null> {
    const response = await this.customerFacade.getAll();
    if (!response) {
      return null;
    }
    return response.map((customer: any) => ({
      customerID: customer.customerID,
      customerName: customer.customerName,
      phoneNumber: customer.phoneNumber,
      email: customer.email,
      revenue: customer.revenue,
      customerType: customer.customerType || null,
    }));
  }
}