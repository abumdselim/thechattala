'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function PostsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/admin/posts?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter('search', search)
  }

  const clearFilters = () => {
    setSearch('')
    router.push('/admin/posts')
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search by title or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" size="sm">Search</Button>
          </form>

          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={searchParams.get('pinned') || ''}
            onChange={(e) => updateFilter('pinned', e.target.value)}
          >
            <option value="">All Posts</option>
            <option value="true">Pinned Only</option>
            <option value="false">Not Pinned</option>
          </select>
        </div>

        {(searchParams.toString()) && (
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
