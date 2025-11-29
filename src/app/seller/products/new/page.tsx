'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
import { PRODUCT_UNITS } from '@/lib/constants';
import { AlertCircle, Save, Upload, X, Image as ImageIcon } from 'lucide-react';
import type { Category } from '@/lib/types';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [businessId, setBusinessId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    stock_qty: '',
    unit: 'piece',
    type: 'product' as 'product' | 'service',
    active: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Get current user's business
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: business } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_user_id', user.id)
          .single();

        if (business) {
          setBusinessId(business.id);
        }
      }

      // Get categories
      const { data: cats } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('name');

      if (cats) {
        setCategories(cats);
      }
    };

    fetchData();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    setImageFiles([...imageFiles, ...files]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const uploadImages = async (productId: string) => {
    if (imageFiles.length === 0) return [];

    const supabase = createClient();
    const uploadedUrls: string[] = [];

    setUploading(true);

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${productId}/${Date.now()}-${i}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }

    setUploading(false);
    return uploadedUrls;
  };

  const updateFormData = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!businessId) {
      setError('You must register a business first');
      setLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      // Create product first
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          business_id: businessId,
          name: formData.name,
          slug: generateSlug(formData.name),
          description: formData.description,
          category_id: formData.category_id || null,
          price: parseFloat(formData.price),
          stock_qty: parseInt(formData.stock_qty) || 0,
          unit: formData.unit,
          type: formData.type,
          active: formData.active,
        })
        .select()
        .single();

      if (productError) throw productError;

      // Upload images if any
      if (imageFiles.length > 0 && product) {
        const imageUrls = await uploadImages(product.id);

        // Create image records
        if (imageUrls.length > 0) {
          const imageRecords = imageUrls.map((url, index) => ({
            product_id: product.id,
            file_url: url,
            is_primary: index === 0,
            display_order: index,
          }));

          await supabase.from('product_images').insert(imageRecords);
        }
      }

      router.push('/seller/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  if (!businessId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No Business Registered</h3>
            <p className="text-muted-foreground mb-4">
              You need to register your business before adding products
            </p>
            <Button onClick={() => router.push('/seller/register')}>
              Register Business
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Add New Product</h1>
        <p className="text-muted-foreground">
          Create a new product listing for your business
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>
              Provide accurate information about your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name *</label>
              <Input
                placeholder="e.g., Fresh Kaukau (Sweet Potato)"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Describe your product..."
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => updateFormData('category_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type *</label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'product' | 'service') => updateFormData('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price (PGK) *</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => updateFormData('price', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Quantity</label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.stock_qty}
                  onChange={(e) => updateFormData('stock_qty', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Unit *</label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => updateFormData('unit', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_UNITS.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Product Images (Max 5)</label>
              <div className="border-2 border-dashed rounded-lg p-6">
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <label htmlFor="images" className="cursor-pointer">
                    <span className="text-primary hover:text-primary/80 font-medium">
                      Click to upload
                    </span>
                    <span className="text-muted-foreground"> or drag and drop</span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, WEBP up to 5MB each
                  </p>
                  <input
                    id="images"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={imageFiles.length >= 5}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => updateFormData('active', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="active" className="text-sm font-medium">
                Make product active (visible to buyers)
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading || uploading}>
            <Save className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading images...' : loading ? 'Creating...' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
