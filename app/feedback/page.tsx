"use client";

import { toast } from "@/hooks/use-toast";
import { createFeedback } from "@/lib/actions/feedback.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAllProduct } from "@/lib/actions/menu.action";
import { Product } from "@/types/products";

const formSchema = z.object({
  fullname: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phonenumber: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  content: z.string().min(10, {
    message: "Feedback must be at least 10 characters.",
  }),
  starNumber: z.number().min(1).max(5),
  dishes: z.array(
    z.object({
      name: z.string().min(1, "Please select a dish"),
      rating: z.number().min(1).max(5),
    }),
  ),
});

const dishes = [
  { label: "Espresso", value: "espresso" },
  { label: "Cappuccino", value: "cappuccino" },
  { label: "Latte", value: "latte" },
  { label: "Mocha", value: "mocha" },
  { label: "Americano", value: "americano" },
];

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dishRatings, setDishRatings] = useState([{ name: "", rating: 0 }]);
  const [products, setProducts] = useState<Product[]>([]);
  const [ratedProducts, setRatedProducts] = useState<Product[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      phonenumber: "",
      content: "",
      starNumber: 0,
      dishes: [{ name: "", rating: 0 }],
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const data: Product[] = await getAllProduct();
      setProducts(data);
    };
    fetchProduct();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await createFeedback({
        ...values,
        listProdFb: values.dishes
          .filter((dish) => dish.name && dish.rating > 0)
          .map((dish) => {
            const product = products.find(
              (product) => product.productName === dish.name,
            );
            if (!product) {
              throw new Error("Product not found");
            }
            return {
              productID: product?.productID,
              star: dish?.rating || 0,
            };
          }),
      });
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
        variant: "success",
      });
      form.reset();
      setRating(0);
      setDishRatings([{ name: "", rating: 0 }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Customer Review</h1>
          <p className="mt-2 text-gray-500">We value your feedback!</p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="mb-6 flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 cursor-pointer ${
                      star <= (form.watch("starNumber") || rating)
                        ? "fill-[#00B074] text-[#00B074]"
                        : "text-gray-300"
                    }`}
                    onClick={() => {
                      setRating(star);
                      form.setValue("starNumber", star);
                    }}
                  />
                ))}
              </div>

              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phonenumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Feedback</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us what you think..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {dishRatings.map((dish, index) => (
                <div key={index} className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`dishes.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dish {index + 1}</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            const selectedProduct = products.find(
                              (p) => p.productName === value,
                            );
                            if (selectedProduct) {
                              setRatedProducts((prev) => [
                                ...prev,
                                selectedProduct,
                              ]);
                            }
                          }}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a dish" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products
                              .filter(
                                (product) =>
                                  !ratedProducts.some(
                                    (ratedProduct) =>
                                      ratedProduct.productID ===
                                      product.productID,
                                  ) || product.productName === field.value,
                              )
                              .map((product: Product) => (
                                <SelectItem
                                  key={product.productID}
                                  value={product.productName}
                                >
                                  {product.productName}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`dishes.${index}.rating`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dish Rating</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-6 w-6 cursor-pointer ${
                                  star <= field.value
                                    ? "fill-[#00B074] text-[#00B074]"
                                    : "text-gray-300"
                                }`}
                                onClick={() =>
                                  form.setValue(`dishes.${index}.rating`, star)
                                }
                              />
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setDishRatings([...dishRatings, { name: "", rating: 0 }]);
                  form.setValue(`dishes.${dishRatings.length}`, {
                    name: "",
                    rating: 0,
                  });
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Another Dish
              </Button>

              <Button
                type="submit"
                className="w-full bg-[#00B074] hover:bg-[#00B074]/90"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
