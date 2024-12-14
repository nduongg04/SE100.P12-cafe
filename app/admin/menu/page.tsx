"use client";

import CategoryButton from "@/components/admin/CategoryButton";
import DishCardMenu from "@/components/admin/DishCardMenu";
import DishForm, { dishFormSchema } from "@/components/admin/DishForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { initialCategories } from "@/constants";
import { toast } from "@/hooks/use-toast";
import {
  addProduct,
  deleteProduct,
  getAllProduct,
  updateProduct,
} from "@/lib/actions/menu.action";
import { uploadImage } from "@/lib/actions/upload.action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Tally3, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import * as z from "zod";

import { useDebounce } from "@/hooks/use-debounce";
import LoadingSpinner from "@/components/admin/LoadingSpinner";

export default function ProductMenu() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDishDialogOpen, setIsAddDishDialogOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const categories = initialCategories;

  const queryClient = useQueryClient();

  useEffect(() => {
    console.log(activeCategory);
  }, [activeCategory]);

  const { data: dishes = [] as Dish[], isLoading: isFetching } = useQuery<
    Dish[]
  >({
    queryKey: ["dishes"],
    queryFn: async () => {
      const dishes = await getAllProduct();
      if (!dishes) {
        toast({
          title: "Failed to fetch dishes",
          description: "Please try again",
          variant: "destructive",
        });
        return [];
      }
      return dishes;
    },
  });

  const filteredDishes = useMemo(() => {
    return dishes.filter(
      (d) =>
        (activeCategory === "all" || d.categoryName === activeCategory) &&
        d.productName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    );
  }, [debouncedSearchTerm, dishes, activeCategory]);

  const addMutation = useMutation({
    mutationFn: async (newDish: z.infer<typeof dishFormSchema>) => {
      setIsLoading(true);
      if (typeof window !== 'undefined' && newDish.image instanceof (window as any).File) {
        const formData = new FormData();
        formData.append("file", newDish.image);
        const uploadImageUrl = (await uploadImage(formData))?.imageUrl;
        if (!uploadImageUrl) {
          throw new Error("Failed to upload image");
        }
        const dish = (
          await addProduct({
            ...newDish,
            image: uploadImageUrl,
          })
        )?.data;
        if (!dish) {
          throw new Error("Failed to add dish");
        }
        setIsAddDishDialogOpen(false);
        setIsLoading(false);
        return dish;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      toast({
        title: "Success",
        description: "Dish added successfully",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add dish",
        variant: "destructive",
      });
    },
  });

  const modifyMutation = useMutation({
    mutationFn: async (updatedDish: z.infer<typeof dishFormSchema>) => {
      setIsLoading(true);
      console.log(updatedDish);
      if (!editingDish) throw new Error("No dish selected for editing");

      let imageUrl = editingDish.image;

      if (typeof window !== 'undefined' && updatedDish.image instanceof (window as any).File) {
        try {
          const formData = new FormData();
          formData.append("file", updatedDish.image);
          const uploadData = await uploadImage(formData);

          if (!uploadData?.imageUrl) {
            throw new Error("Failed to upload image");
          }
          console.log(uploadData);
          imageUrl = uploadData.imageUrl;
        } catch (error) {
          setIsLoading(false);
          throw new Error("Image upload failed");
        }
      }

      try {
        const dish = await updateProduct({
          ...updatedDish,
          productID: editingDish.productID,
          image: imageUrl,
        });

        if (!dish?.data) {
          throw new Error("Failed to modify dish");
        }

        setIsLoading(false);
        setEditingDish(null);
        console.log(dish.data);
        return dish.data;
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      toast({
        title: "Success",
        description: "Dish modified successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to modify dish",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (productID: number) => {
      const message = await deleteProduct(productID);
      if (!message) {
        throw new Error("Failed to delete dish");
      }
      return message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      toast({
        title: "Success",
        description: "Dish deleted successfully",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete dish",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-12 p-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Our Menu</h1>
        <p className="mx-auto max-w-2xl text-xl text-gray-600">
          Explore our wide range of delicious dishes and beverages
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 space-y-4 sm:flex-row sm:space-y-0">
        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
          <CategoryButton
            category={{ categoryID: 0, categoryName: "All", icon: Tally3 }}
            isActive={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          />
          {categories.map((category) => (
            <CategoryButton
              key={category.categoryID}
              category={category}
              isActive={activeCategory === category.categoryName}
              onClick={() => setActiveCategory(category.categoryName)}
            />
          ))}
        </div>
        <div className="relative flex-1 sm:w-auto">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <Input
            type="text"
            placeholder="Search dishes..."
            className="w-64 border-gray-300 py-2 pl-10 pr-4 focus:border-[#00B074] focus:ring-[#00B074] lg:w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Dialog
          open={isAddDishDialogOpen}
          onOpenChange={setIsAddDishDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="bg-[#00B074] text-white hover:bg-[#00956A]">
              <Plus className="mr-2 h-4 w-4" />
              Add New Dish
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Dish</DialogTitle>
            </DialogHeader>
            <DishForm
              isLoading={isLoading}
              categories={categories}
              onSubmit={addMutation.mutate}
              onCancel={() => setIsAddDishDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredDishes.map((dish) => (
          <DishCardMenu
            key={dish.productID}
            dish={dish}
            onModify={() => setEditingDish(dish)}
            onDelete={() => deleteMutation.mutate(dish.productID)}
          />
        ))}
      </div>
      {isFetching ? (
		<LoadingSpinner />
      ) : filteredDishes.length === 0 ? (
        <div className="py-12 text-center">
          <h3 className="mb-2 text-2xl font-semibold text-gray-700">
            No dishes found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or category filter.
          </p>
        </div>
      ) : null}

      <Dialog
        open={!!editingDish}
        onOpenChange={(open) => !open && setEditingDish(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modify Dish</DialogTitle>
          </DialogHeader>
          {editingDish && (
            <DishForm
              isLoading={isLoading}
              dish={editingDish}
              categories={categories}
              onSubmit={modifyMutation.mutate}
              onCancel={() => setEditingDish(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
