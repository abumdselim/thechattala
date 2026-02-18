'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { approveProduct, rejectProduct, deleteProduct } from '@/app/actions/admin'
import { toast } from 'sonner'

interface Product {
  id: string
  title: string
  status: string
}

export function ProductsActions({ product }: { product: Product }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)

  const handleApprove = async () => {
    if (product.status === 'APPROVED') return
    
    setLoading(true)
    try {
      await approveProduct(product.id)
      toast.success('Product approved successfully')
      router.refresh()
    } catch {
      toast.error('Failed to approve product')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    setLoading(true)
    try {
      await rejectProduct(product.id)
      toast.success('Product rejected')
      setShowRejectDialog(false)
      router.refresh()
    } catch {
      toast.error('Failed to reject product')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteProduct(product.id)
      toast.success('Product deleted successfully')
      setShowDeleteDialog(false)
      router.refresh()
    } catch {
      toast.error('Failed to delete product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex justify-end gap-2">
        {product.status !== 'APPROVED' && (
          <Button
            size="sm"
            variant="default"
            onClick={handleApprove}
            disabled={loading}
          >
            Approve
          </Button>
        )}
        
        {product.status !== 'REJECTED' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowRejectDialog(true)}
            disabled={loading}
          >
            Reject
          </Button>
        )}
        
        <Button
          size="sm"
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          disabled={loading}
        >
          Delete
        </Button>
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject &quot;{product.title}&quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={loading}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{product.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
