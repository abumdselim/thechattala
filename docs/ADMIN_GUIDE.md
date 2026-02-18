# Admin Panel User Guide

This guide explains how to use the TheChattala admin panel to manage users, products, posts, and platform settings.

## Accessing the Admin Panel

1. Log in with an admin account
2. Navigate to `/admin` or click "Admin" in the navigation menu
3. You'll see the admin dashboard

## Dashboard Overview

The admin dashboard provides:

- **Statistics Cards**: Total users, products, posts, and pending items
- **Recent Activity**: Latest platform activity
- **Quick Actions**: Common admin tasks
- **Pending Items**: Items requiring review

## User Management (`/admin/users`)

### View Users

- Browse all registered users
- Filter by role (User/Admin)
- Filter by verification status
- Filter by suspension status
- Search users by name or email

### Verify Users

1. Click on a user
2. Click "Verify User" button
3. User receives verified badge

Verified users get:
- Verified badge on profile
- Increased trust from community
- Priority in search results

### Change User Roles

1. Click on a user
2. Select "Change Role"
3. Choose User or Admin
4. Confirm action

**Note**: Admin users have full platform access.

### Suspend Users

1. Click on a user
2. Click "Suspend User"
3. Provide reason (optional)
4. Confirm suspension

Suspended users:
- Cannot log in
- Cannot post or list products
- All content remains visible but marked

### Unsuspend Users

1. Go to suspended users filter
2. Click on suspended user
3. Click "Unsuspend"

## Product Management (`/admin/products`)

### View Products

- Browse all products
- Filter by status (Pending/Approved/Rejected)
- Filter by category
- Search by title or description

### Approve Products

1. Click on a pending product
2. Review product details
3. Click "Approve"

Approved products:
- Visible in marketplace
- Searchable
- Appear in category listings

### Reject Products

1. Click on a product
2. Click "Reject"
3. Provide reason
4. Confirm rejection

Rejected products:
- Not visible in marketplace
- Seller is notified
- Can be re-submitted after edits

### Delete Products

1. Click on a product
2. Click "Delete"
3. Confirm deletion

Use for:
- Spam
- Inappropriate content
- Duplicate listings
- Scams

## Post Management (`/admin/posts`)

### View Posts

- Browse all community posts
- Filter by pinned status
- Search by title or content

### Pin Posts

1. Click on a post
2. Click "Pin Post"
3. Post appears at top of community feed

Pin important posts like:
- Announcements
- Guidelines
- Community events
- Important updates

### Unpin Posts

1. Go to pinned posts filter
2. Click on pinned post
3. Click "Unpin"

### Delete Posts

1. Click on a post
2. Click "Delete"
3. Provide reason
4. Confirm deletion

Delete posts that:
- Violate community guidelines
- Contain spam
- Are inappropriate
- Are reported by users

**Note**: Deleting a post also deletes all comments.

## Settings (`/admin/settings`)

### Category Management

#### Add Category

1. Go to Settings > Categories
2. Click "Add Category"
3. Fill in:
   - Name (English)
   - Name (Bangla) - optional
   - Slug (URL-friendly)
   - Description
4. Click "Create"

#### Edit Category

1. Click on category
2. Update fields
3. Click "Save"

#### Delete Category

1. Click on category
2. Click "Delete"
3. Confirm deletion

**Warning**: Cannot delete categories with existing products.

### Site Configuration

Configure platform settings:

- Site name
- Description
- Contact email
- Maintenance mode
- Feature toggles

## Reports and Analytics

### User Activity

- New user registrations
- Active users
- User growth trends

### Product Analytics

- Total listings
- Category distribution
- Approval rates
- Popular categories

### Community Metrics

- Total posts
- Comments per post
- Active discussions
- Engagement rates

## Moderation Best Practices

### Verification

- Verify users who have:
  - Complete profiles
  - Successful transactions
  - Good community standing
  - Active for 30+ days

### Product Approval

Approve products that:
- Have clear images
- Accurate descriptions
- Reasonable prices
- Valid contact info
- Follow guidelines

Reject products with:
- Prohibited items
- Misleading info
- Inappropriate content
- Poor quality images
- Missing information

### Content Moderation

Delete content that violates:
- Community guidelines
- Legal requirements
- Platform policies
- User safety

Take action on:
- Spam
- Harassment
- Hate speech
- Scams
- Inappropriate content

### Communication

When taking action:
- Be clear and concise
- Provide reasons
- Link to relevant policies
- Offer guidance for improvement
- Respond to appeals fairly

## Security

### Admin Account Security

- Use strong passwords
- Enable 2FA if available
- Don't share credentials
- Log out when done
- Monitor admin activity

### Audit Logs

Review admin actions:
- Who made changes
- What was changed
- When it happened
- Why it was changed

## Getting Help

For admin support:
- Check this guide first
- Review [API Documentation](API.md)
- Contact platform admin
- Report bugs on GitHub

## Tips

- Regular moderation improves community quality
- Quick approval/rejection keeps users engaged
- Pin important announcements
- Verify active, trustworthy users
- Monitor reports and feedback
- Stay updated on community trends
