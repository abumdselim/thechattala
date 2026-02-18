import { getUserProducts } from '@/app/actions/products'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import Image from 'next/image'
import { Package, Plus, Eye, Edit, Trash2 } from 'lucide-react'
import { DeleteProductButton } from './delete-product-button'

export default async function ProductsPage() {
  const products = await getUserProducts()

  if (products.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <Link href="/marketplace/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Product
            </Button>
          </Link>
        </div>
        <EmptyState
          icon={Package}
          title="No products yet"
          description="Create your first product to start selling on TheChattala marketplace."
          action={{
            label: 'Create Product',
            href: '/marketplace/create',
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your products ({products.length} total)
          </p>
        </div>
        <Link href="/marketplace/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Product
          </Button>
        </Link>
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <Card key={product.id} className="p-4">
            <div className="flex gap-4">
              <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                {product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  ৳{product.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={product.status} />
                  <span className="text-xs text-gray-500">
                    {product.category?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Link href={`/marketplace/${product.id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/marketplace/${product.id}/edit`}>
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <DeleteProductButton productId={product.id} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop View - Table */}
      <Card className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    {product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="font-medium text-gray-900 truncate">
                      {product.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {product.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {product.category?.name || 'Uncategorized'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    ৳{product.price.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={product.status} />
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/marketplace/${product.id}`}>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/marketplace/${product.id}/edit`}>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <DeleteProductButton productId={product.id} iconOnly />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variants = {
    PENDING: { 
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100', 
      text: 'Pending' 
    },
    APPROVED: { 
      className: 'bg-green-100 text-green-800 hover:bg-green-100', 
      text: 'Approved' 
    },
    REJECTED: { 
      className: 'bg-red-100 text-red-800 hover:bg-red-100', 
      text: 'Rejected' 
    },
  }

  const config = variants[status as keyof typeof variants] || variants.PENDING

  return (
    <Badge variant="default" className={config.className}>
      {config.text}
    </Badge>
  )
}
