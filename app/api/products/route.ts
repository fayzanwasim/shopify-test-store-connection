import { NextRequest, NextResponse } from 'next/server';
import { ShopifyService } from '@/app/services/shopify-service';
import { generateCSV } from '@/app/utils/data-export';

export async function POST(request: NextRequest) {
  try {
    const { format } = await request.json();

    const domain = process.env.SHOPIFY_DOMAIN;
    const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!domain || !accessToken) {
      return NextResponse.json(
        { error: 'Shopify credentials are not configured on the server' },
        { status: 500 }
      );
    }

    const shopifyService = new ShopifyService({ domain, accessToken });
    const products = await shopifyService.getAllProducts();

    if (format === 'csv') {
      const csv = generateCSV(products);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="products.csv"',
        },
      });
    } else {
        return NextResponse.json({ products });
    }
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: error.message || 'Error fetching products' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Please use POST request' },
    { status: 400 }
  );
} 