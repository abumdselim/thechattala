# API Documentation

This document covers the server actions and API routes available in TheChattala platform.

## Server Actions

Server actions are located in `src/app/actions/` and provide secure server-side operations.

### Admin Actions (`admin.ts`)

#### `getStats()`

Get platform statistics.

**Returns:**
```typescript
{
  totalUsers: number
  totalProducts: number
  totalPosts: number
  pendingProducts: number
  verifiedUsers: number
}
```

#### `getUsers(filters)`

Get users list with filters.

**Parameters:**
- `role?: 'USER' | 'ADMIN'`
- `verified?: boolean`
- `suspended?: boolean`
- `search?: string`

**Returns:** Array of users

#### `verifyUser(userId)`

Verify a user account.

**Parameters:**
- `userId: string` - User ID to verify

**Returns:** Updated user object

#### `suspendUser(userId, reason?)`

Suspend a user account.

**Parameters:**
- `userId: string` - User ID to suspend
- `reason?: string` - Optional suspension reason

**Returns:** Updated user object

#### `changeUserRole(userId, role)`

Change user's role.

**Parameters:**
- `userId: string` - User ID
- `role: 'USER' | 'ADMIN'` - New role

**Returns:** Updated user object

#### `getProducts(filters)`

Get products with filters.

**Parameters:**
- `status?: 'PENDING' | 'APPROVED' | 'REJECTED'`
- `categoryId?: string`
- `search?: string`

**Returns:** Array of products

#### `approveProduct(productId)`

Approve a product listing.

**Parameters:**
- `productId: string` - Product ID to approve

**Returns:** Updated product object

#### `rejectProduct(productId, reason?)`

Reject a product listing.

**Parameters:**
- `productId: string` - Product ID to reject
- `reason?: string` - Rejection reason

**Returns:** Updated product object

#### `deleteProduct(productId)`

Delete a product permanently.

**Parameters:**
- `productId: string` - Product ID to delete

**Returns:** Deleted product object

#### `getPosts(filters)`

Get posts with filters.

**Parameters:**
- `pinned?: boolean`
- `search?: string`

**Returns:** Array of posts

#### `pinPost(postId)`

Pin a post to top.

**Parameters:**
- `postId: string` - Post ID to pin

**Returns:** Updated post object

#### `deletePost(postId)`

Delete a post permanently.

**Parameters:**
- `postId: string` - Post ID to delete

**Returns:** Deleted post object

### Product Actions (`products.ts`)

#### `createProduct(data)`

Create a new product listing.

**Parameters:**
```typescript
{
  title: string
  titleBn?: string
  description: string
  price: number
  images: string[]
  categoryId: string
  location?: string
  contact?: string
}
```

**Returns:** Created product object

#### `updateProduct(productId, data)`

Update an existing product.

**Parameters:**
- `productId: string`
- `data: Partial<ProductData>`

**Returns:** Updated product object

#### `deleteProduct(productId)`

Delete own product.

**Parameters:**
- `productId: string`

**Returns:** Deleted product object

#### `getProducts(filters)`

Get marketplace products.

**Parameters:**
```typescript
{
  categoryId?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  location?: string
}
```

**Returns:** Array of approved products

#### `getProduct(productId)`

Get single product details.

**Parameters:**
- `productId: string`

**Returns:** Product object with seller info

### Post Actions (`posts.ts`)

#### `createPost(data)`

Create a new community post.

**Parameters:**
```typescript
{
  title: string
  titleBn?: string
  content: string
  image?: string
}
```

**Returns:** Created post object

#### `updatePost(postId, data)`

Update an existing post.

**Parameters:**
- `postId: string`
- `data: Partial<PostData>`

**Returns:** Updated post object

#### `deletePost(postId)`

Delete own post.

**Parameters:**
- `postId: string`

**Returns:** Deleted post object

#### `getPosts(filters)`

Get community posts.

**Parameters:**
```typescript
{
  search?: string
  authorId?: string
}
```

**Returns:** Array of posts

#### `getPost(postId)`

Get single post with comments.

**Parameters:**
- `postId: string`

**Returns:** Post object with comments and author

#### `createComment(postId, content)`

Add comment to post.

**Parameters:**
- `postId: string`
- `content: string`

**Returns:** Created comment object

### User Actions (`user.ts`)

#### `getProfile()`

Get current user profile.

**Returns:** User object

#### `updateProfile(data)`

Update user profile.

**Parameters:**
```typescript
{
  name?: string
  image?: string
}
```

**Returns:** Updated user object

#### `getUserProducts()`

Get user's own products.

**Returns:** Array of user's products

#### `getUserPosts()`

Get user's own posts.

**Returns:** Array of user's posts

## API Routes

API routes are located in `src/app/api/`.

### `/api/upload` (POST)

Upload image to Cloudinary.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with 'file' field

**Parameters:**
```typescript
{
  file: File
  folder: 'products' | 'posts' | 'avatars'
}
```

**Response:**
```typescript
{
  url: string
  success: boolean
}
```

**Error Response:**
```typescript
{
  error: string
  success: false
}
```

## Authentication

All server actions and API routes requiring authentication check:

1. User is logged in (Supabase auth)
2. User exists in database
3. User is not suspended

Admin-only actions additionally check:
- User role is 'ADMIN'

## Error Handling

All actions return errors in consistent format:

```typescript
{
  error: string
  success: false
}
```

Or throw errors for:
- Unauthorized access
- Invalid input
- Database errors

## Rate Limiting

Currently no rate limiting implemented. Consider adding for production:

- User actions: 100 requests/minute
- Admin actions: 500 requests/minute
- File uploads: 10 uploads/minute

## Security

### Input Validation

All inputs are validated using Zod schemas before processing.

### Authorization

- User actions check ownership
- Admin actions check admin role
- File uploads check file type and size

### SQL Injection

Prisma ORM provides protection against SQL injection.

### XSS Protection

- User inputs are sanitized
- React escapes output by default
- Image URLs are validated

## Examples

### Creating a Product

```typescript
import { createProduct } from '@/app/actions/products'

const product = await createProduct({
  title: 'Vintage Camera',
  description: 'Canon AE-1 in excellent condition',
  price: 15000,
  images: ['https://cloudinary.com/...'],
  categoryId: 'category-id',
  location: 'Chattogram',
  contact: '+8801234567890'
})
```

### Approving Product (Admin)

```typescript
import { approveProduct } from '@/app/actions/admin'

const approved = await approveProduct('product-id')
```

### Uploading Image

```typescript
const formData = new FormData()
formData.append('file', file)
formData.append('folder', 'products')

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
})

const { url } = await response.json()
```

## Development

### Adding New Actions

1. Create action file in `src/app/actions/`
2. Add 'use server' directive
3. Implement authentication checks
4. Validate inputs with Zod
5. Return consistent response format
6. Document in this file

### Testing Actions

```typescript
// In your test file
import { createProduct } from '@/app/actions/products'

test('creates product', async () => {
  const product = await createProduct({
    // ... data
  })
  expect(product.id).toBeDefined()
})
```
