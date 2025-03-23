"use client";
import type { products, products_categories } from "@prisma/client";
import { type FC, createContext, useEffect, useState } from "react";

export type ShopContext = {
	selectedProduct: products | null;
	setSelectedProduct: (product: products) => void;
	selectedCategory: products_categories | null;
	setSelectedCategory: (category: products_categories) => void;
	filteredProducts: products[] | [];
	setFilteredProducts: (products: products[]) => void;
	confirmPaymentCallback: () => void;
	setConfirmPaymentCallback: (callback: () => void) => void;
};

export const ShopContext = createContext<ShopContext>({
	selectedCategory: null,
	filteredProducts: [],
	selectedProduct: null,
	setSelectedCategory: () => {},
	setFilteredProducts: () => {},
	setSelectedProduct: () => {},
	confirmPaymentCallback: () => {},
	setConfirmPaymentCallback: () => {},
});

export const ShopContextProvider: FC<{
	children: React.ReactNode;
	products: products[];
	productCategories: products_categories[];
}> = ({ children, products, productCategories }) => {
	const [selectedCategory, setSelectedCategory] = useState<products_categories>(
		productCategories[0],
	);
	const [filteredProducts, setFilteredProducts] = useState<products[]>([]);
	const [selectedProduct, setSelectedProduct] = useState<products | null>(null);
	const [confirmPaymentCallback, setConfirmPaymentCallback] = useState<() => void>(() => {});

	useEffect(() => {
		setFilteredProducts(products.filter((p) => p.category_id === selectedCategory?.id));
		setSelectedProduct(filteredProducts[0]);
	}, [selectedCategory]);

	return (
		<ShopContext.Provider
			value={{
				selectedProduct,
				setSelectedProduct,
				selectedCategory,
				setSelectedCategory,
				filteredProducts,
				setFilteredProducts,
				confirmPaymentCallback,
				setConfirmPaymentCallback,
			}}
		>
			{children}
		</ShopContext.Provider>
	);
};
