import React from 'react';
import { Product } from '@/types';

interface SEOSchemaProps {
  type: 'organization' | 'product';
  product?: Product;
}

export default function SEOSchema({ type, product }: SEOSchemaProps) {
  if (type === 'organization') {
    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'OnlineStore',
      '@id': 'https://nextshot.vercel.app/#organization',
      'name': 'NextShot',
      'url': 'https://nextshot.vercel.app',
      'logo': 'https://nextshot.vercel.app/logo-luxury.jpg',
      'description': 'America\'s premier e-commerce liquor portal offering ultra-premium spirits, rare whiskey allocations, and wine delivery.',
      'telephone': '+1-800-555-SHOT',
      'priceRange': '$$$$',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '500 Madison Avenue',
        'addressLocality': 'New York',
        'addressRegion': 'NY',
        'postalCode': '10022',
        'addressCountry': 'US'
      },
      'sameAs': [
        'https://facebook.com/nextshot',
        'https://instagram.com/nextshot',
        'https://twitter.com/nextshot'
      ]
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
    );
  }

  if (type === 'product' && product) {
    const isOutOfStock = product.stock <= 0;
    const categoryName = typeof product.category === 'object' && product.category 
      ? product.category.name 
      : 'Spirits';

    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': product.title,
      'image': product.images,
      'description': product.description,
      'sku': product.sku,
      'mpn': product.sku,
      'brand': {
        '@type': 'Brand',
        'name': 'NextShot Signature'
      },
      'category': categoryName,
      'offers': {
        '@type': 'Offer',
        'url': `https://nextshot.vercel.app/product/${product.slug}`,
        'priceCurrency': 'USD',
        'price': product.price,
        'itemCondition': 'https://schema.org/NewCondition',
        'availability': isOutOfStock 
          ? 'https://schema.org/OutOfStock' 
          : 'https://schema.org/InStock',
        'priceValidUntil': '2028-12-31',
        'shippingDetails': {
          '@type': 'OfferShippingDetails',
          'shippingRate': {
            '@type': 'MonetaryAmount',
            'value': product.price >= 150 ? 0 : 15,
            'currency': 'USD'
          },
          'shippingDestination': {
            '@type': 'DefinedRegion',
            'addressCountry': 'US'
          }
        }
      },
      'aggregateRating': product.ratings.count > 0 ? {
        '@type': 'AggregateRating',
        'ratingValue': product.ratings.average,
        'reviewCount': product.ratings.count,
        'bestRating': '5',
        'worstRating': '1'
      } : undefined
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    );
  }

  return null;
}
