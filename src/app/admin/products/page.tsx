'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  ChevronDown,
  AlertTriangle,
  Check,
  X,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, Category } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    story: '',
    price: '',
    costPrice: '',
    sku: '',
    stock: '',
    category: '',
    images: '',
    abv: '',
    origin: '',
    size: '750ml',
    featured: false,
    trending: false,
    bestSeller: false,
    metaTitle: '',
    metaDescription: ''
  });

  const [formError, setFormError] = useState('');

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch products and categories
      const [resProducts, resCategories] = await Promise.all([
        fetch('/api/products?limit=100'),
        fetch('/api/categories')
      ]);

      const dataProducts = await resProducts.json();
      const dataCategories = await resCategories.json();

      if (dataProducts.success) setProducts(dataProducts.products);
      if (dataCategories.success) setCategories(dataCategories.categories);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Title to slug automatic conversion
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // remove special characters
      .replace(/\s+/g, '-')         // replace spaces with hyphens
      .replace(/-+/g, '-');         // remove duplicate hyphens
    
    setFormData(prev => ({
      ...prev,
      title,
      slug: modalMode === 'add' ? slug : prev.slug // only auto-generate slug in add mode
    }));
  };

  const openAddModal = () => {
    setModalMode('add');
    setCurrentProductId(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      story: '',
      price: '',
      costPrice: '',
      sku: '',
      stock: '',
      category: categories[0]?._id || '',
      images: '',
      abv: '',
      origin: '',
      size: '750ml',
      featured: false,
      trending: false,
      bestSeller: false,
      metaTitle: '',
      metaDescription: ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setModalMode('edit');
    setCurrentProductId(product._id);
    const catId = typeof product.category === 'object' ? product.category._id : product.category;
    setFormData({
      title: product.title,
      slug: product.slug,
      description: product.description,
      story: product.story || '',
      price: product.price.toString(),
      costPrice: product.costPrice.toString(),
      sku: product.sku,
      stock: product.stock.toString(),
      category: catId,
      images: product.images.join(', '),
      abv: product.abv.toString(),
      origin: product.origin,
      size: product.size,
      featured: product.featured,
      trending: product.trending,
      bestSeller: product.bestSeller,
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you absolute sure you want to remove this fine reserve from the vault?')) return;
    
    try {
      setActionLoading(true);
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p._id !== productId));
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Basic validations
    if (!formData.title || !formData.slug || !formData.description || !formData.price || !formData.sku || !formData.category || !formData.images || !formData.abv || !formData.origin) {
      setFormError('Please fill in all required fields marked with *');
      return;
    }

    setActionLoading(true);

    const formattedBody = {
      ...formData,
      price: parseFloat(formData.price),
      costPrice: parseFloat(formData.costPrice || '0'),
      stock: parseInt(formData.stock || '0', 10),
      abv: parseFloat(formData.abv),
      images: formData.images.split(',').map(img => img.trim()).filter(Boolean)
    };

    try {
      let res;
      if (modalMode === 'add') {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedBody)
        });
      } else {
        res = await fetch(`/api/products/${currentProductId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedBody)
        });
      }

      const data = await res.json();

      if (data.success) {
        setIsModalOpen(false);
        fetchData();
      } else {
        setFormError(data.error || 'An error occurred during submission.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Server error, please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter products based on search and selected options
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.origin.toLowerCase().includes(searchQuery.toLowerCase());
    
    const catId = typeof p.category === 'object' ? p.category._id : p.category;
    const matchesCategory = selectedCategory ? catId === selectedCategory : true;
    
    let matchesStock = true;
    if (stockFilter === 'out') {
      matchesStock = p.stock === 0;
    } else if (stockFilter === 'low') {
      matchesStock = p.stock > 0 && p.stock <= 5;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Back button & Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <Link href="/admin" className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition flex items-center gap-1.5 mb-2 font-mono">
            <ArrowLeft className="h-3 w-3" />
            Back to Command Terminal
          </Link>
          <h1 className="text-2xl md:text-3xl text-editorial tracking-wide text-foreground">
            Spirits Vault Management
          </h1>
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono">
            Curate, edit, and control your ultra-premium liquor collections
          </p>
        </div>

        <div>
          <button
            onClick={openAddModal}
            className="btn-gold px-5 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Acquire New Reserve
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, SKU, origin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-muted/30 border border-border/60 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/80 transition uppercase tracking-wider"
          />
        </div>

        {/* Category Select */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2.5 bg-muted/30 border border-border/60 text-xs text-foreground focus:outline-none focus:border-primary/80 transition uppercase tracking-widest appearance-none"
          >
            <option value="" className="bg-background">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id} className="bg-background">
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Stock Filter */}
        <div className="relative">
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="w-full px-4 py-2.5 bg-muted/30 border border-border/60 text-xs text-foreground focus:outline-none focus:border-primary/80 transition uppercase tracking-widest appearance-none"
          >
            <option value="all" className="bg-background">All Inventory Levels</option>
            <option value="low" className="bg-background">Low Stock (≤ 5)</option>
            <option value="out" className="bg-background">Depleted / Out of Stock</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Info Box */}
        <div className="flex items-center justify-end px-3 text-[10px] text-muted-foreground uppercase tracking-widest font-mono border border-border/20 bg-muted/10">
          Showing {filteredProducts.length} of {products.length} Reserves
        </div>

      </div>

      {/* Main Table */}
      {loading ? (
        <div className="luxury-glass p-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Unlocking reserve vault...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="luxury-glass p-20 text-center space-y-3">
          <AlertTriangle className="h-8 w-8 text-primary mx-auto opacity-75" />
          <p className="text-[11px] uppercase tracking-widest text-foreground font-semibold">No Collections Found</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search criteria or register a new custom liquor reserve above.
          </p>
        </div>
      ) : (
        <div className="luxury-glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-foreground font-bold font-mono">
                  <th className="p-4 w-20">Preview</th>
                  <th className="p-4">Reserve details</th>
                  <th className="p-4">Sku</th>
                  <th className="p-4">Origin / Metrics</th>
                  <th className="p-4 text-right">Acquisition cost</th>
                  <th className="p-4 text-right">Retail price</th>
                  <th className="p-4 text-center">Stock status</th>
                  <th className="p-4 text-right">Vault Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 font-medium">
                {filteredProducts.map((p) => {
                  const catName = typeof p.category === 'object' ? p.category.name : '';
                  const isLowStock = p.stock > 0 && p.stock <= 5;
                  const isOut = p.stock === 0;
                  
                  return (
                    <tr key={p._id} className="hover:text-foreground hover:bg-muted/10 duration-200">
                      <td className="p-4">
                        <div className="h-14 w-12 bg-muted/30 border border-border/40 relative overflow-hidden flex items-center justify-center">
                          {p.images && p.images[0] ? (
                            <img src={p.images[0]} alt={p.title} className="object-contain h-full w-full p-1" />
                          ) : (
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </td>
                      <td className="p-4 max-w-xs">
                        <div className="space-y-1">
                          <span className="text-foreground font-semibold block text-[11.5px] tracking-wide">{p.title}</span>
                          <span className="text-[9px] px-2 py-0.5 border border-primary/20 bg-primary/5 text-primary tracking-widest inline-block font-mono">
                            {catName || 'Spirits'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-mono select-all text-muted-foreground">{p.sku}</td>
                      <td className="p-4">
                        <div className="space-y-0.5 font-mono text-[10px]">
                          <div>Origin: <span className="text-foreground">{p.origin}</span></div>
                          <div>ABV: <span className="text-foreground">{p.abv}%</span></div>
                          <div>Size: <span className="text-foreground">{p.size}</span></div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono text-muted-foreground">${p.costPrice.toFixed(2)}</td>
                      <td className="p-4 text-right font-mono font-bold text-primary">${p.price.toFixed(2)}</td>
                      <td className="p-4 text-center">
                        <span className={`text-[8.5px] font-bold px-2 py-1 font-mono border ${
                          isOut 
                            ? 'border-red-500/20 bg-red-950/20 text-red-400' 
                            : isLowStock 
                              ? 'border-amber-500/20 bg-amber-950/20 text-amber-400 animate-pulse' 
                              : 'border-green-500/20 bg-green-950/20 text-green-400'
                        }`}>
                          {isOut ? 'Depleted' : isLowStock ? `Only ${p.stock} Left` : `${p.stock} Vaulted`}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => openEditModal(p)}
                            disabled={actionLoading}
                            className="p-1.5 border border-border/80 text-muted-foreground hover:text-primary hover:border-primary/50 transition duration-300 disabled:opacity-50"
                            title="Edit Vault Info"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            disabled={actionLoading}
                            className="p-1.5 border border-border/80 text-muted-foreground hover:text-red-400 hover:border-red-400/50 transition duration-300 disabled:opacity-50"
                            title="Purge from Vault"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRUD Side Drawer/Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-background/80 backdrop-blur-sm flex items-center justify-end">
            
            {/* Backdrop click */}
            <div className="absolute inset-0" onClick={() => !actionLoading && setIsModalOpen(false)} />

            {/* Modal Box */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl min-h-screen bg-black border-l border-border/80 shadow-2xl p-6 md:p-8 flex flex-col justify-between"
            >
              <div>
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-primary font-bold font-mono">Vault Registry</span>
                    <h2 className="text-xl text-editorial text-foreground font-semibold">
                      {modalMode === 'add' ? 'Acquire New Spirits Reserve' : 'Update Spirit Vault Record'}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    disabled={actionLoading}
                    className="p-1 border border-border hover:border-primary transition text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Form */}
                <form id="productForm" onSubmit={handleSubmit} className="space-y-5 text-xs text-muted-foreground uppercase tracking-widest font-mono">
                  
                  {formError && (
                    <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Title & Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-foreground font-semibold">Bottle Name *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={handleTitleChange}
                        placeholder="e.g. Pappy Van Winkle 15 Year"
                        className="w-full px-3 py-2 bg-muted/20 border border-border text-foreground focus:outline-none focus:border-primary transition"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-foreground font-semibold">Slug Identifier *</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase() }))}
                        placeholder="pappy-van-winkle-15-year"
                        className="w-full px-3 py-2 bg-muted/20 border border-border text-foreground focus:outline-none focus:border-primary transition select-all lowercase"
                        required
                      />
                    </div>
                  </div>

                  {/* Category & SKU */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-foreground font-semibold">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 bg-muted/20 border border-border text-foreground focus:outline-none focus:border-primary transition uppercase tracking-wider"
                        required
                      >
                        {categories.map((c) => (
                          <option key={c._id} value={c._id} className="bg-background text-foreground uppercase">{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-foreground font-semibold">SKU Code *</label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                        placeholder="e.g. WHI-PVW-15"
                        className="w-full px-3 py-2 bg-muted/20 border border-border text-foreground focus:outline-none focus:border-primary transition uppercase"
                        required
                      />
                    </div>
                  </div>

                  {/* Price, Cost Price, Stock */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-foreground font-semibold">Retail Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="1199.99"
                        className="w-full px-3 py-2 bg-muted/20 border border-border text-foreground focus:outline-none focus:border-primary transition font-mono"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-foreground font-semibold">Wholesale Cost ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.costPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, costPrice: e.target.value }))}
                        placeholder="450.00"
                        className="w-full px-3 py-2 bg-muted/20 border border-border text-foreground focus:outline-none focus:border-primary transition font-mono"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-foreground font-semibold">Stock Quantity *</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                        placeholder="12"
                        className="w-full px-3 py-2 bg-muted/20 border border-border text-foreground focus:outline-none focus:border-primary transition font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* Metrics: ABV, Origin, Size */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-foreground font-semibold">Alcohol By Vol (ABV %) *</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={formData.abv}
                        onChange={(e) => setFormData(prev => ({ ...prev, abv: e.target.value }))}
                        placeholder="45.2"
                        className="w-full px-3 py-2 bg-muted/20 border border-border text-foreground focus:outline-none focus:border-primary transition font-mono"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-foreground font-semibold">Origin / Region *</label>
                      <input
                        type="text"
                        value={formData.origin}
                        onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                        placeholder="Kentucky, USA"
                        className="w-full px-3 py-2 bg-muted/20 border border-border text-foreground focus:outline-none focus:border-primary transition"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-foreground font-semibold">Bottle Size *</label>
                      <select
                        value={formData.size}
                        onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                        className="w-full px-3 py-2 bg-muted/20 border border-border text-foreground focus:outline-none focus:border-primary transition"
                        required
                      >
                        <option value="750ml">750ml Standard</option>
                        <option value="1L">1L Magnum</option>
                        <option value="1.75L">1.75L Handle</option>
                        <option value="375ml">375ml Half-Bottle</option>
                      </select>
                    </div>
                  </div>

                  {/* Image URLs */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-foreground font-semibold">Image URLs (comma separated) *</label>
                    <input
                      type="text"
                      value={formData.images}
                      onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value }))}
                      placeholder="https://images.unsplash.com/photo-1592751864159-850f4e416fa7"
                      className="w-full px-3 py-2 bg-muted/20 border border-border text-foreground focus:outline-none focus:border-primary transition tracking-normal font-sans"
                      required
                    />
                    <p className="text-[9px] text-muted-foreground uppercase font-mono tracking-wider font-semibold">
                      Use Unsplash or CDN links. We recommend clean dark background bottle designs.
                    </p>
                  </div>

                  {/* Descriptions */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-foreground font-semibold">Client Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed notes on taste profiles, nose metrics, and finish ratings..."
                      rows={2}
                      className="w-full px-3 py-2 bg-muted/20 border border-border text-foreground focus:outline-none focus:border-primary transition tracking-normal font-sans"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-foreground font-semibold">Editorial Heritage Story (Optional)</label>
                    <textarea
                      value={formData.story}
                      onChange={(e) => setFormData(prev => ({ ...prev, story: e.target.value }))}
                      placeholder="The background narrative, history of the distillery, and aging metrics..."
                      rows={2}
                      className="w-full px-3 py-2 bg-muted/20 border border-border text-foreground focus:outline-none focus:border-primary transition tracking-normal font-sans"
                    />
                  </div>

                  {/* SEO Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-foreground font-semibold">SEO Meta Title (Optional)</label>
                      <input
                        type="text"
                        value={formData.metaTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                        placeholder="Luxury Pappy Van Winkle 15 Year"
                        className="w-full px-3 py-2 bg-muted/20 border border-border text-foreground focus:outline-none focus:border-primary transition tracking-normal font-sans"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-foreground font-semibold">SEO Meta Description (Optional)</label>
                      <input
                        type="text"
                        value={formData.metaDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                        placeholder="Buy rare Pappy Van Winkle 15 Yr Bourbon on NextShot..."
                        className="w-full px-3 py-2 bg-muted/20 border border-border text-foreground focus:outline-none focus:border-primary transition tracking-normal font-sans"
                      />
                    </div>
                  </div>

                  {/* Collections Flags */}
                  <div className="flex flex-wrap items-center gap-6 pt-2 select-none border-t border-border/30">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="rounded border-border text-primary focus:ring-0 focus:ring-offset-0 h-4 w-4 bg-muted/20"
                      />
                      <span className="text-[10px] text-foreground font-semibold">Featured Spirit</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.trending}
                        onChange={(e) => setFormData(prev => ({ ...prev, trending: e.target.checked }))}
                        className="rounded border-border text-primary focus:ring-0 focus:ring-offset-0 h-4 w-4 bg-muted/20"
                      />
                      <span className="text-[10px] text-foreground font-semibold">Trending Now</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.bestSeller}
                        onChange={(e) => setFormData(prev => ({ ...prev, bestSeller: e.target.checked }))}
                        className="rounded border-border text-primary focus:ring-0 focus:ring-offset-0 h-4 w-4 bg-muted/20"
                      />
                      <span className="text-[10px] text-foreground font-semibold">Best Seller</span>
                    </label>
                  </div>

                </form>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-border/80 pt-6 mt-6 flex items-center justify-end gap-3 uppercase tracking-widest font-mono text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={actionLoading}
                  className="px-5 py-2.5 border border-border hover:border-foreground text-muted-foreground hover:text-foreground transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="productForm"
                  disabled={actionLoading}
                  className="btn-gold px-6 py-2.5 text-xs text-black font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                >
                  {actionLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                  {modalMode === 'add' ? 'Confirm Acquisition' : 'Apply Changes'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
