"use server";

import { authenticatedFetch } from "../auth";

export const getAllProduct = async () => {
  try {
    console.log(process.env.BASE_URL);
    const response = await authenticatedFetch(
      `${process.env.BASE_URL}/product/getall`,
      { method: "GET" },
    );
    const data = await response.json();
    return data.map((dish: Dish) => ({
      ...dish,
      categoryName:
        dish.categoryName === "Đồ ăn"
          ? "Food"
          : dish.categoryName === "Đồ uống"
            ? "Drink"
            : "Other",
    }));
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const addProduct = async (dish: Omit<Dish, "productID">) => {
  try {
    const response = await authenticatedFetch(
      `${process.env.BASE_URL}/product/create`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          categoryId:
            dish.categoryName === "Food"
              ? 1
              : dish.categoryName === "Drink"
                ? 2
                : 4,
          image: dish.image,
          price: dish.price,
          productName: dish.productName,
          isSoldOut: dish.isSoldOut,
        }),
      },
    );

    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteProduct = async (productID: number) => {
  try {
    const response = await authenticatedFetch(
      `${process.env.BASE_URL}/product/delete/${productID}`,
      { method: "DELETE" },
    );
    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};


export const updateProduct = async (dish: Dish) => {
	try {
		console.log(dish)
		const response = await authenticatedFetch(
			`${process.env.BASE_URL}/product/update/${dish.productID}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
				method: "PUT",
				body: JSON.stringify({
					categoryId: dish.categoryName === "Food" ? 1 : dish.categoryName === "Drink" ? 2 : 4,
					image: dish.image,
					price: dish.price,
					productName: dish.productName,
					isSoldOut: dish.isSoldOut,
				}),
			},
		);
		return response.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}
