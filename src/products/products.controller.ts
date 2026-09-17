import { Controller, Get, Param, Post, Body, Delete, Put, Headers, NotFoundException, ForbiddenException, UnprocessableEntityException, UnsupportedMediaTypeException } from '@nestjs/common';

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
    { id: '10', name: 'Glutamina Micronizada ON', category: 'aminoacids', stock: 0, expirationDate: '2025-02-14' },
  ];

  @Get('')
  getProducts() {
    return this.products;
  }

  @Get('id/:id')
  getProductById(@Param('id') id: string) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  @Get('stock/out-of-stock')
  getOutOfStockProducts() {
    const outOfStock = this.products.filter((p) => p.stock === 0);
    if (outOfStock.length === 0) {
      throw new NotFoundException('Product not found');
    }
    return outOfStock;
  }

  @Get('expiration/expired')
  getExpiredProducts() {
    const currentDate = new Date();
    const expired = this.products.filter((p) => new Date(p.expirationDate) < currentDate);
    if (expired.length === 0) {
      throw new NotFoundException('Product not found');
    }
    return expired;
  }

  @Get('category/:category')
  getProductsByCategory(@Param('category') category: string) {
    const filtered = this.products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    if (filtered.length === 0) {
      throw new NotFoundException('Product not found');
    }
    return filtered;
  }

  @Post()
  createProduct(@Body() product: Product) {
    if (product.stock < 0) {
      throw new UnprocessableEntityException('Stock cannot be negative');
    }

    const exists = this.products.find((p) => p.id === product.id);
    if (exists) {
      throw new ForbiddenException('The product is already registered');
    }

    this.products.push(product);
    return {
      msg: 'Product created successfully',
      data: product,
    };
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException('Product not found');
    }

    this.products.splice(index, 1);
    return {
      msg: 'Product deleted successfully',
    };
  }

  @Put(':id')
  updateProduct(@Param('id') id: string, @Body() productChanges: Product) {
    if (productChanges.stock !== undefined && productChanges.stock < 0) {
      throw new UnprocessableEntityException('Stock cannot be negative');
    }

    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException('Product not found');
    }

    this.products[index] = { ...this.products[index], ...productChanges };
    return {
      msg: 'Product updated successfully',
      data: this.products[index],
    };
  }

  @Post(':id/image')
  uploadProductImage(@Param('id') id: string, @Headers('content-type') contentType: string, @Body() body: any) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!contentType || !allowedTypes.includes(contentType)) {
      throw new UnsupportedMediaTypeException('Unsupported media type. Only PNG, JPEG, or WEBP image formats are allowed');
    }

    return {
      msg: `Image uploaded successfully for product: ${product.name}`,
      data: body,
    };
  }
}
