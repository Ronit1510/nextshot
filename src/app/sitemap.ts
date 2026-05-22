import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nextshot.vercel.app';
  
  // Public static pages
  const staticRoutes = [
    '',
    '/shop',
    '/categories',
    '/about',
    '/contact',
    '/faq',
    '/terms',
    '/privacy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // In production, we would fetch products from database here to create dynamic shop slugs
  // const products = await fetchProductsFromDb();
  // const dynamicRoutes = products.map((prod) => ({ ... }));

  return [...staticRoutes];
}
