'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { PNG_PROVINCES } from '@/lib/constants';
import type { Category } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';

interface MarketplaceFiltersProps {
  categories: Category[];
}

export function MarketplaceFilters({ categories }: MarketplaceFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedProvince, setSelectedProvince] = useState(searchParams.get('province') || '');

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset to page 1 when filters change
    params.delete('page');

    router.push(`/marketplace?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/marketplace');
    setSelectedCategory('');
    setSelectedProvince('');
  };

  const hasActiveFilters = selectedCategory || selectedProvince;

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Active Filters</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 px-2"
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1">
                Category
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    updateFilters('category', '');
                  }}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedProvince && (
              <Badge variant="secondary" className="gap-1">
                {selectedProvince}
                <button
                  onClick={() => {
                    setSelectedProvince('');
                    updateFilters('province', '');
                  }}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

      {/* Categories Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <button
              onClick={() => {
                setSelectedCategory('');
                updateFilters('category', '');
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                !selectedCategory
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  updateFilters('category', category.id);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Province Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Province</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <button
              onClick={() => {
                setSelectedProvince('');
                updateFilters('province', '');
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                !selectedProvince
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              All Provinces
            </button>
            {PNG_PROVINCES.map((province) => (
              <button
                key={province}
                onClick={() => {
                  setSelectedProvince(province);
                  updateFilters('province', province);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedProvince === province
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                {province}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
