# Deployment Guide

This guide covers deploying TheChattala platform to production.

## Prerequisites

- GitHub account
- Vercel account (recommended) or other hosting platform
- PostgreSQL database (Supabase, Neon, or other provider)
- Supabase project for authentication
- Cloudinary account for image uploads

## Vercel Deployment (Recommended)

### Step 1: Prepare Your Repository

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the repository: `abumdselim/thechattala`

### Step 3: Configure Environment Variables

Add all environment variables from your `.env.example`:

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be live at `https://your-project.vercel.app`

### Step 5: Database Setup

After first deployment:

```bash
# Set DATABASE_URL environment variable
export DATABASE_URL="your_production_database_url"

# Run migrations
npx prisma migrate deploy

# Optional: Seed database
npm run seed
```

### Step 6: Create Admin User

1. Sign up on your deployed site
2. Connect to your production database
3. Update user role to ADMIN:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
   ```

## Alternative: Railway Deployment

### Step 1: Create Railway Account

1. Go to [Railway.app](https://railway.app/)
2. Sign up with GitHub

### Step 2: Deploy Database

1. Create new project
2. Add PostgreSQL plugin
3. Copy DATABASE_URL from variables

### Step 3: Deploy Application

1. Add "GitHub Repo" service
2. Select your repository
3. Add environment variables
4. Deploy

## Alternative: Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Build and Run

```bash
docker build -t thechattala .
docker run -p 3000:3000 --env-file .env thechattala
```

## Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test user registration and login
- [ ] Test image uploads
- [ ] Create admin account
- [ ] Test admin panel access
- [ ] Test marketplace features
- [ ] Test community features
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring and analytics
- [ ] Configure backup strategy

## Database Backup

### Automated Backups

Most providers offer automated backups:

- **Supabase**: Daily automated backups
- **Neon**: Point-in-time restore
- **Vercel Postgres**: Automated backups

### Manual Backup

```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Import database
psql $DATABASE_URL < backup.sql
```

## Monitoring

### Vercel Analytics

Enable Vercel Analytics in your project settings for:
- Page views
- Performance metrics
- User insights

### Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Datadog for monitoring

## Updating Deployment

### Automatic Deployments

Vercel automatically deploys:
- Main branch to production
- Pull requests to preview URLs

### Manual Deployment

```bash
# Using Vercel CLI
npm i -g vercel
vercel --prod
```

## Troubleshooting

### Build Failures

- Check build logs in Vercel dashboard
- Verify all dependencies are listed in `package.json`
- Ensure environment variables are set correctly

### Database Connection Issues

- Verify DATABASE_URL format
- Check database server is accessible
- Ensure IP allowlist includes Vercel IPs

### Supabase Auth Issues

- Verify Supabase URLs and keys
- Check redirect URLs in Supabase dashboard
- Ensure site URL matches deployment URL

## Rollback

If deployment has issues:

1. Go to Vercel dashboard
2. Select previous successful deployment
3. Click "Promote to Production"

## Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Visit [GitHub Issues](https://github.com/abumdselim/thechattala/issues)
