"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { MARKETPLACE_CATEGORIES, PRODUCT_CONDITIONS, PRICE_RANGES, SORT_OPTIONS } from "@/lib/constants"
import { X } from "lucide-react"

interface ProductFiltersProps {
  filters: {
    categoryId?: string
    minPrice?: number
    maxPrice?: number
    condition?: string
    search?: string
    sortBy?: string
  }
  onFilterChange: (filters: any) => void
  categories: Array<{ id: string; name: string; slug: string }>
}

export function ProductFilters({ filters, onFilterChange, categories }: ProductFiltersProps) {
  const handleCategoryChange = (categoryId: string) => {
    onFilterChange({
      ...filters,
      categoryId: filters.categoryId === categoryId ? undefined : categoryId,
    })
  }

  const handleConditionChange = (condition: string) => {
    onFilterChange({
      ...filters,
      condition: filters.condition === condition ? undefined : condition,
    })
  }

  const handlePriceRangeChange = (min: number, max: number) => {
    const isSelected = filters.minPrice === min && filters.maxPrice === max
    onFilterChange({
      ...filters,
      minPrice: isSelected ? undefined : min,
      maxPrice: isSelected ? undefined : max === Infinity ? undefined : max,
    })
  }

  const handleSearchChange = (search: string) => {
    onFilterChange({
      ...filters,
      search: search || undefined,
    })
  }

  const handleSortChange = (sortBy: string) => {
    onFilterChange({
      ...filters,
      sortBy: sortBy === 'newest' ? undefined : sortBy,
    })
  }

  const clearFilters = () => {
    onFilterChange({})
  }

  const hasActiveFilters = !!(
    filters.categoryId ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.condition ||
    filters.search
  )

  return (
    <div className="space-y-4">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search products..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Sort */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sort By</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {SORT_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={filters.sortBy === option.value || (!filters.sortBy && option.value === 'newest') ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start"
              onClick={() => handleSortChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={filters.categoryId === category.id}
                onCheckedChange={() => handleCategoryChange(category.id)}
              />
              <Label
                htmlFor={category.id}
                className="flex-1 cursor-pointer text-sm font-normal"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <div key={range.label} className="flex items-center space-x-2">
              <Checkbox
                id={range.label}
                checked={filters.minPrice === range.min && (filters.maxPrice === range.max || (range.max === Infinity && !filters.maxPrice))}
                onCheckedChange={() => handlePriceRangeChange(range.min, range.max)}
              />
              <Label
                htmlFor={range.label}
                className="flex-1 cursor-pointer text-sm font-normal"
              >
                {range.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Condition */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Condition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {PRODUCT_CONDITIONS.map((condition) => (
            <div key={condition.value} className="flex items-center space-x-2">
              <Checkbox
                id={condition.value}
                checked={filters.condition === condition.value}
                onCheckedChange={() => handleConditionChange(condition.value)}
              />
              <Label
                htmlFor={condition.value}
                className="flex-1 cursor-pointer text-sm font-normal"
              >
                {condition.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full"
          onClick={clearFilters}
        >
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  )
}
