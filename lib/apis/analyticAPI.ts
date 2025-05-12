import {
  getProductReport,
  getReportBill,
  getRevenue,
  getRevenueByDate,
} from "../actions/analytics.action";

interface AnalyticClientInterface {
  getRevenue(start: string, end: string): Promise<any>;
  getRevenueByDate(date: string): Promise<any>;
  getProductReport(start: string, end: string): Promise<any>;
  getReportBill(start: string, end: string): Promise<any>;
}

// Real Subject
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

// Real Subject Implementation
class AnalyticApiAdapter implements AnalyticClientInterface {
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

// Proxy Implementation
export class AnalyticApiProxy implements AnalyticClientInterface {
  private realAnalyticApi: AnalyticApiAdapter;
  private cache: Map<string, { data: any; timestamp: number }>;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.realAnalyticApi = new AnalyticApiAdapter();
    this.cache = new Map();
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  private getCacheKey(method: string, ...args: any[]): string {
    return `${method}:${JSON.stringify(args)}`;
  }

  private async handleRequest<T>(
    cacheKey: string,
    operation: () => Promise<T>,
  ): Promise<T> {
    try {
      // Check cache first
      if (this.isCacheValid(cacheKey)) {
        console.log(`Cache hit for ${cacheKey}`);
        return this.cache.get(cacheKey)!.data;
      }

      console.log(`Cache miss for ${cacheKey}, fetching fresh data`);
      const startTime = Date.now();
      const result = await operation();
      const endTime = Date.now();

      console.log(`API call took ${endTime - startTime}ms`);

      // Update cache
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      console.error(`Error in analytics operation: ${cacheKey}`, error);
      throw error;
    }
  }

  async getRevenue(start: string, end: string): Promise<any> {
    const cacheKey = this.getCacheKey("getRevenue", start, end);
    return this.handleRequest(cacheKey, () =>
      this.realAnalyticApi.getRevenue(start, end),
    );
  }

  async getRevenueByDate(date: string): Promise<any> {
    const cacheKey = this.getCacheKey("getRevenueByDate", date);
    return this.handleRequest(cacheKey, () =>
      this.realAnalyticApi.getRevenueByDate(date),
    );
  }

  async getProductReport(start: string, end: string): Promise<any> {
    const cacheKey = this.getCacheKey("getProductReport", start, end);
    return this.handleRequest(cacheKey, () =>
      this.realAnalyticApi.getProductReport(start, end),
    );
  }

  async getReportBill(start: string, end: string): Promise<any> {
    const cacheKey = this.getCacheKey("getReportBill", start, end);
    return this.handleRequest(cacheKey, () =>
      this.realAnalyticApi.getReportBill(start, end),
    );
  }
}

// Export a singleton instance
export const analyticAPI = new AnalyticApiProxy();
