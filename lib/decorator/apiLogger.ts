export class ApiLoggerDecorator {
  private readonly apiFunction: (...args: any[]) => Promise<any>;

  constructor(apiFunction: (...args: any[]) => Promise<any>) {
    this.apiFunction = apiFunction;
  }

  async execute(...args: any[]): Promise<any> {
    const startTime = Date.now();
    try {
      console.log(`[API CALL START] Arguments:`, args);

      const result = await this.apiFunction(...args);

      const endTime = Date.now();
      console.log(`[API CALL SUCCESS] Duration: ${endTime - startTime}ms`);
      console.log(`[API CALL RESULT]:`, result);

      return result;
    } catch (error) {
      const endTime = Date.now();
      console.error(`[API CALL FAILED] Duration: ${endTime - startTime}ms`);
      console.error(`[API CALL ERROR]:`, error);

      throw error;
    }
  }
}
