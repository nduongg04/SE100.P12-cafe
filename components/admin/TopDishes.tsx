import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

type ProductReportData = {
  product: {
    productID: number;
    productName: string;
    price: number;
    image: string;
    isSoldOut: boolean;
    categoryName: string;
  };
  orderCount: number;
};

type TopDishesProps = {
  data: ProductReportData[];
};

export default function TopDishes({ data }: TopDishesProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Dishes</CardTitle>
          <CardDescription>No data available for the selected period</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Only show top 5 dishes
  const topFiveDishes = data.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Dishes</CardTitle>
        <CardDescription>Most ordered products for the selected period</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-4">
          {topFiveDishes.map((item) => (
            <Card key={item.product.productID}>
              <CardContent className="flex flex-col items-center p-4">
                <Image
                  src={item.product.image}
                  alt={item.product.productName}
                  width={100}
                  height={100}
                  className="mb-2 rounded-full"
                />
                <h3 className="text-lg font-semibold text-center">{item.product.productName}</h3>
                <p className="text-sm text-gray-500">{item.product.categoryName}</p>
                <p className="mt-2 text-xl font-bold text-[#00B074]">
                  ${item.product.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
                <p className="mt-1 text-sm">Orders: {item.orderCount}</p>
                {item.product.isSoldOut && (
                  <span className="mt-2 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                    Sold Out
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

