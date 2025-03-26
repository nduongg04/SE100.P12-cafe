import { getRevenue, getRevenueByDate, getProductReport, getReportBill } from "../actions/analytics.action";

interface AnalyticClientInterface {
  getRevenue(start: string, end: string): Promise<any>;
  getRevenueByDate(date: string): Promise<any>;
  getProductReport(start: string, end: string): Promise<any>;
  getReportBill(start: string, end: string): Promise<any>;
}

class AnalyticFacade {
  static async getRevenue(start: string, end: string) {
    return await getRevenue(start, end);
  }
  static async getRevenueByDate(date: string) {
    return await getRevenueByDate(date);
  }
  static async getProductReport(start: string, end: string) {
    return await getProductReport(start, end);
  }
  static async getReportBill(start: string, end: string) {
    return await getReportBill(start, end);
  }
} 
export class AnalyticApiAdapter implements AnalyticClientInterface {
  private analyticFacade: typeof AnalyticFacade;
  constructor() {
    this.analyticFacade = AnalyticFacade;
  } 
  async getRevenue(start: string, end: string): Promise<any> {
    return await this.analyticFacade.getRevenue(start, end);
  }
  async getRevenueByDate(date: string): Promise<any> {
    return await this.analyticFacade.getRevenueByDate(date);
  }
  async getProductReport(start: string, end: string): Promise<any> {
    return await this.analyticFacade.getProductReport(start, end);
  }
  async getReportBill(start: string, end: string): Promise<any> {
    return await this.analyticFacade.getReportBill(start, end);
  }
}
