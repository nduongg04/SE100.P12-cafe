
import { addProduct, deleteProduct, getAllProduct, updateProduct } from "../actions/menu.action";
interface ProductClientInterface {
  getAll(): Promise<Dish[] | null>;
  add(product: {
    productName: string;
    price: number;
    image: string;
    isSoldOut: boolean;
    categoryName: string;
  }): Promise<Dish | null>;
  update(product: Dish): Promise<Dish | null>;
  delete(productID: number): Promise<Dish | null>;
}
class ProductFacade {
  static async getAll() {
    return await getAllProduct();
  }
  static async add(product: Omit<Dish, "productID">) {
    return await addProduct(product);
  }
  static async update(product: Dish) {
    return await updateProduct(product);
  }
  static async delete(productID: number) {
    return await deleteProduct(productID);
  }
}
export class ProductApiAdapter implements ProductClientInterface {
  private productFacade: typeof ProductFacade;
  constructor() {
    this.productFacade = ProductFacade;
  }
  async getAll(): Promise<Dish[] | null> {
    const products = await this.productFacade.getAll();
    if (!products) {
      return null;
    }
    return products.map((product: any) => ({
      productID: product.productID,
      productName: product.productName,
      price: product.price,
      image: product.image,
      isSoldOut: product.isSoldOut,
      categoryName: product.categoryName,
    })) as Dish[];
  }
  async add(product: {
    productName: string;
    price: number;
    image: string;
    isSoldOut: boolean;
    categoryName: string;
  }): Promise<Dish | null> {
    const res = await this.productFacade.add(product);
    if (!res) {
      return null;
    }
    return res as Dish;
  }
  async update(product: Dish): Promise<Dish | null> {
    return await this.productFacade.update(product);
  }
  async delete(productID: number): Promise<Dish | null> {
    return await this.productFacade.delete(productID);
  }
}

