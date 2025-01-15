// Implement a function which takes an array of Product and returns unique products sorted by price

type Product = {
    name: string;
    price: number;
};

function filterAndSortProducts(products: Product[]): Product[] {
    const uniqueProductsMap = new Map<string, Product>();
    for (const product of products) {
        uniqueProductsMap.set(product.name, product);
    }

    const uniqueProductsArray = Array.from(uniqueProductsMap.values());

    uniqueProductsArray.sort((a, b) => a.price - b.price);

    return uniqueProductsArray;
}

module.exports = { filterAndSortProducts };
