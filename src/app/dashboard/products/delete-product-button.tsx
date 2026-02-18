'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'
import { deleteProduct } from '@/app/actions/products'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function DeleteProductButton({ 
  productId,
  iconOnly = false 
}: { 
  productId: string
  iconOnly?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteProduct(productId)
      toast.success('Product deleted successfully')
      setOpen(false)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant={iconOnly ? 'ghost' : 'outline'}
        onClick={() => setOpen(true)}
      >
        <Trash2 className={iconOnly ? 'w-4 h-4' : 'w-3 h-3 mr-1'} />
        {!iconOnly && 'Delete'}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
