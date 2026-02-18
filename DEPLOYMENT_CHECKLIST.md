# Deployment Checklist for TheChattala Platform

## ✅ Pre-Deployment Checklist

### 1. Database Setup
- [ ] PostgreSQL database created (locally or cloud)
- [ ] DATABASE_URL environment variable configured
- [ ] Run: `npx prisma generate`
- [ ] Run: `npx prisma db push` or `npx prisma migrate deploy`
- [ ] (Optional) Run: `npm run seed` to populate sample data

### 2. Supabase Configuration
- [ ] Supabase project created
- [ ] Email authentication enabled in Supabase dashboard
- [ ] (Optional) Google OAuth configured with credentials
- [ ] Redirect URLs configured:
  - `http://localhost:3000/auth/callback` (development)
  - `https://your-domain.com/auth/callback` (production)
- [ ] Environment variables set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

### 3. Cloudinary Configuration
- [ ] Cloudinary account created
- [ ] Upload preset created (Signing Mode: Unsigned)
- [ ] Folder structure set up: thechattala/{products,posts,avatars}
- [ ] Environment variables set:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
  - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

### 4. Environment Variables
Create `.env` file with all required variables (see `.env.example`):

```env
# Database
DATABASE_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="123456789"
CLOUDINARY_API_SECRET="abc..."
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your_preset"

# Application
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### 5. Build Test
- [ ] Run: `npm install`
- [ ] Run: `npm run build` (requires DATABASE_URL)
- [ ] Fix any build errors
- [ ] Test locally: `npm run dev`

### 6. Code Quality
- [ ] Run: `npm run lint`
- [ ] Fix any linting errors
- [ ] All TypeScript types are correct
- [ ] No console errors in development

## 🚀 Vercel Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Import to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the repository: `abumdselim/thechattala`

### Step 3: Configure Project
- **Framework Preset:** Next.js
- **Root Directory:** ./
- **Build Command:** `npm run build`
- **Output Directory:** .next
- **Install Command:** `npm install`

### Step 4: Environment Variables
Add all environment variables from your `.env` file in Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add each variable:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel URL)

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your site will be live at: `https://your-project.vercel.app`

### Step 6: Post-Deployment Setup
1. Update `NEXT_PUBLIC_APP_URL` in Vercel to your actual domain
2. Update Supabase redirect URLs to include your production URL
3. Update Cloudinary settings if needed

## 🔐 Create First Admin User

### Option 1: Via Prisma Studio
```bash
npx prisma studio
```
1. Open Users table
2. Find your user account
3. Change `role` field from `USER` to `ADMIN`
4. Save

### Option 2: Via Database Query
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

### Option 3: Via Script
Create a script or use the database console to promote a user to admin.

## ✅ Post-Deployment Verification

### Test All Features
- [ ] Visit homepage - navigation works
- [ ] Sign up new account
- [ ] Login with credentials
- [ ] Browse marketplace
- [ ] Create a product
- [ ] Upload images
- [ ] View community posts
- [ ] Create a post
- [ ] Add comments
- [ ] Access dashboard
- [ ] Edit profile
- [ ] Upload avatar
- [ ] Login as admin
- [ ] Access admin panel
- [ ] Verify users
- [ ] Approve products
- [ ] Manage categories

### Performance Check
- [ ] Page load times acceptable
- [ ] Images loading properly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Forms submit correctly

### Security Check
- [ ] Protected routes require login
- [ ] Admin routes require admin role
- [ ] Users can only edit their own content
- [ ] File upload validation working
- [ ] SQL injection protected (Prisma)
- [ ] XSS protection in place

## 🛠️ Troubleshooting

### Build Fails
**Problem:** Build fails with database connection error
**Solution:** Ensure DATABASE_URL is set in Vercel environment variables

### Authentication Not Working
**Problem:** Can't login or signup
**Solution:** Check Supabase environment variables and redirect URLs

### Images Not Uploading
**Problem:** Image upload fails
**Solution:** Verify Cloudinary credentials and upload preset configuration

### Admin Panel Not Accessible
**Problem:** Can't access /admin routes
**Solution:** Make sure you've promoted your user to ADMIN role in database

### 404 Errors
**Problem:** Routes returning 404
**Solution:** Rebuild and redeploy, clear Vercel cache

## 📱 Mobile Testing

Test on actual devices:
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Tablet view
- [ ] Navigation menu works
- [ ] Forms are usable
- [ ] Images display correctly

## 🎯 Launch Checklist

Before going live:
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Analytics set up (optional)
- [ ] Error tracking configured (optional)
- [ ] Backup strategy in place
- [ ] Admin account created
- [ ] Test data removed or marked
- [ ] Terms of service added (optional)
- [ ] Privacy policy added (optional)

## 🎉 You're Live!

Congratulations! Your TheChattala platform is now live and ready for users.

### Share Your Platform
- Website: `https://your-domain.com`
- Admin Panel: `https://your-domain.com/admin`
- Marketplace: `https://your-domain.com/marketplace`
- Community: `https://your-domain.com/community`

### Monitor Your Platform
- Check Vercel Analytics for traffic
- Monitor database usage
- Watch for error reports
- Respond to user feedback
- Keep dependencies updated

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/abumdselim/thechattala/issues
- Documentation: See /docs folder
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**Built with ❤️ for the Chittagong community**
