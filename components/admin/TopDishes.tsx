import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Product } from "@/types/products";

type ProductReportData = {
  product: Product;
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
          <CardDescription>
            No data available for the selected period
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Only show top 5 dishes
  const topFiveOrderedDishes = [...data]
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 5);
  const topFiveRatedDishes = [...data]
    .sort((a, b) => b.product.averageStar - a.product.averageStar)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Dishes</CardTitle>
        <CardDescription>
          Most ordered and highest rated products for the selected period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ordered">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ordered">Top Ordered</TabsTrigger>
            <TabsTrigger value="rated">Top Rated</TabsTrigger>
          </TabsList>
          <TabsContent value="ordered">
            <div className="grid grid-cols-3 gap-2 space-x-2 lg:grid-cols-5">
              {topFiveOrderedDishes.map((item) => (
                <DishCard
                  key={item.product.productID}
                  item={item}
                  showOrderCount
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="rated">
            <div className="grid grid-cols-3 gap-2 space-x-2 lg:grid-cols-5">
              {topFiveRatedDishes.map((item) => (
                <DishCard key={item.product.productID} item={item} showRating />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

type DishCardProps = {
  item: ProductReportData;
  showOrderCount?: boolean;
  showRating?: boolean;
};

function DishCard({ item, showOrderCount, showRating }: DishCardProps) {
  return (
    <Card className="row-span-3 grid grid-rows-subgrid justify-items-center p-4 lg:row-span-6">
      <Image
        src={item.product.image}
        alt={item.product.productName}
        width={100}
        height={100}
        className="size-[100px] rounded-full"
      />
      <h3 className="text-center text-lg font-semibold">
        {item.product.productName}
      </h3>
      <p className="text-sm text-gray-500">{item.product.categoryName}</p>
      <p className="text-xl font-bold text-[#00B074]">
        $
        {item.product.price.toLocaleString("en-US", {
          maximumFractionDigits: 0,
        })}
      </p>
      {showOrderCount && <p className="text-sm">Orders: {item.orderCount}</p>}
      {showRating && (
        <p className="text-sm">
          Rating: {item.product.averageStar.toFixed(1)}/5
        </p>
      )}
      {item.product.isSoldOut && (
        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
          Sold Out
        </span>
      )}
    </Card>
  );
}
