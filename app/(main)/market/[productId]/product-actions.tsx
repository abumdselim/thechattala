"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { deleteProduct, toggleProductSold } from "@/lib/actions/product-actions"
import { Edit, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

interface ProductActionsProps {
  productId: string
  sellerId: string
  isSold: boolean
}

export function ProductActions({ productId, sellerId, isSold }: ProductActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleToggleSold = async () => {
    if (!confirm(`Mark this product as ${isSold ? 'available' : 'sold'}?`)) {
      return
    }

    setLoading(true)
    const result = await toggleProductSold(productId, sellerId)
    
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || 'Failed to update product')
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    setDeleteLoading(true)
    const result = await deleteProduct(productId, sellerId)
    
    if (result.success) {
      router.push('/market')
      router.refresh()
    } else {
      alert(result.error || 'Failed to delete product')
      setDeleteLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Manage Listing</h2>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            asChild
          >
            <Link href={`/market/${productId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Listing
            </Link>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleToggleSold}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isSold ? (
              <XCircle className="mr-2 h-4 w-4" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            Mark as {isSold ? 'Available' : 'Sold'}
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete Listing
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
