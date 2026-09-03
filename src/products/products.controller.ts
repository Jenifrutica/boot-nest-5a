import { Controller, Get, Param } from '@nestjs/common';

interface Product {
    id: string;
    name: string;
    category: string;
    stock: number;
    expirationDate: string;
}

@Controller('products')
export class ProductsController {

    private products: Product[] = [
        { id: '1', name: 'Gold Standard 100% Whey', category: 'protein', stock: 15, expirationDate: '2027-05-10' },
        { id: '2', name: 'ISO 100 Dymatize', category: 'protein', stock: 0, expirationDate: '2026-12-01' },
        { id: '3', name: 'C4 Original Pre-Workout', category: 'preworkout', stock: 8, expirationDate: '2025-08-15' },
        { id: '4', name: 'Psychotic Insane Labz', category: 'preworkout', stock: 0, expirationDate: '2027-01-20' },
        { id: '5', name: 'Creatina Creapure Universal', category: 'creatine', stock: 22, expirationDate: '2028-03-30' },
        { id: '6', name: 'Creatina Monohidratada Birdman', category: 'creatine', stock: 5, expirationDate: '2025-11-10' },
        { id: '7', name: 'Multivitamínico Opti-Men', category: 'vitamins', stock: 12, expirationDate: '2027-09-18' },
        { id: '8', name: 'Omega 3 Fish Oil', category: 'vitamins', stock: 0, expirationDate: '2026-04-05' },
        { id: '9', name: 'BCAA 2:1:1 Mutant', category: 'aminoacids', stock: 18, expirationDate: '2027-11-25' },
        { id: '10', name: 'Glutamina Micronizada ON', category: 'aminoacids', stock: 0, expirationDate: '2025-02-14' }
    ];

    @Get('')
    getProducts() {
        return this.products;
    }

    @Get('id/:id')
    getProductById(@Param('id') id: string) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            return 'Product not found';
        }
        return product;
    }

    @Get('stock/out-of-stock')
    getOutOfStockProducts() {
        const outOfStock = this.products.filter(product => product.stock === 0);
        if (outOfStock.length === 0) {
            return 'Product not found';
        }
        return outOfStock;
    }

    @Get('expiration/expired')
    getExpiredProducts() {
        const currentDate = new Date();
        const expired = this.products.filter(product => new Date(product.expirationDate) < currentDate);
        if (expired.length === 0) {
            return 'Product not found';
        }
        return expired;
    }

    @Get('category/:category')
    getProductsByCategory(@Param('category') category: string) {
        const filtered = this.products.filter(
            product => product.category.toLowerCase() === category.toLowerCase()
        );
        if (filtered.length === 0) {
            return 'Product not found';
        }
        return filtered;
    }

}
