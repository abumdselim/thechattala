"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import type { PostFilters as FilterType } from "@/types"

interface PostFiltersProps {
  filters: FilterType
  onFilterChange: (filters: FilterType) => void
  categories: Array<{ id: string; name: string; slug: string }>
}

const SORT_OPTIONS: Array<{ value: 'newest' | 'oldest'; label: string }> = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
]

export function PostFilters({ filters, onFilterChange, categories }: PostFiltersProps) {
  const handleCategoryChange = (categoryId: string) => {
    onFilterChange({
      ...filters,
      categoryId: filters.categoryId === categoryId ? undefined : categoryId,
    })
  }

  const handleVerifiedChange = (checked: boolean) => {
    onFilterChange({
      ...filters,
      isVerified: checked ? true : undefined,
    })
  }

  const handleSearchChange = (search: string) => {
    onFilterChange({
      ...filters,
      search: search || undefined,
    })
  }

  const handleSortChange = (sortBy: 'newest' | 'oldest') => {
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
    filters.isVerified ||
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
            placeholder="Search posts..."
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

      {/* Verified Only */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Verified Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="verified"
              checked={filters.isVerified || false}
              onCheckedChange={handleVerifiedChange}
            />
            <Label
              htmlFor="verified"
              className="cursor-pointer text-sm font-normal"
            >
              Show only verified posts
            </Label>
          </div>
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
