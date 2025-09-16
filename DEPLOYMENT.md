# Deployment Guide - Productivity Bingo

This guide will help you deploy your Productivity Bingo application to various platforms.

## Prerequisites

- Node.js 18+ installed
- A database (PostgreSQL recommended for production)
- Email service (SendGrid, Resend, or SMTP)
- Domain name (optional but recommended)

## Local Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` with your configuration.

3. **Set up Database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Production Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure Environment Variables**
   - Go to your Vercel dashboard
   - Add environment variables in Settings > Environment Variables
   - Set up a PostgreSQL database (Vercel Postgres recommended)

4. **Database Setup**
   ```bash
   vercel env pull .env.local
   npm run db:push
   ```

### Option 2: Railway

1. **Connect Repository**
   - Connect your GitHub repository to Railway
   - Railway will auto-detect Next.js

2. **Add PostgreSQL Database**
   - Add PostgreSQL service in Railway dashboard
   - Copy the DATABASE_URL to environment variables

3. **Configure Environment Variables**
   - Add all required environment variables
   - Deploy automatically

### Option 3: DigitalOcean App Platform

1. **Create App**
   - Connect your GitHub repository
   - Select Next.js as the framework

2. **Add Database**
   - Add managed PostgreSQL database
   - Configure connection string

3. **Set Environment Variables**
   - Add all required environment variables
   - Deploy

### Option 4: Self-Hosted (VPS)

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Clone and Setup**
   ```bash
   git clone <your-repo>
   cd productivity-bingo
   npm install
   npm run build
   ```

3. **Configure Environment**
   ```bash
   cp env.example .env.local
   # Edit .env.local with production values
   ```

4. **Database Setup**
   ```bash
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib
   
   # Create database
   sudo -u postgres createdb productivity_bingo
   
   # Run migrations
   npm run db:push
   ```

5. **Start Application**
   ```bash
   pm2 start npm --name "productivity-bingo" -- start
   pm2 save
   pm2 startup
   ```

## Environment Variables

### Required
```env
DATABASE_URL="postgresql://user:password@localhost:5432/productivity_bingo"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://yourdomain.com"
```

### Email Configuration
```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

### Optional
```env
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

## Database Migration

For production databases, use migrations:

```bash
# Generate migration
npx prisma migrate dev --name init

# Apply migrations
npx prisma migrate deploy
```

## Email Service Setup

### Gmail SMTP
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in EMAIL_PASS

### SendGrid
1. Create SendGrid account
2. Generate API key
3. Use SendGrid API instead of SMTP

### Resend
1. Create Resend account
2. Generate API key
3. Use Resend API

## SSL/HTTPS Setup

### Vercel/Railway/DigitalOcean
- Automatic SSL certificates
- No additional setup required

### Self-Hosted
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

## Monitoring and Maintenance

### Health Checks
- Add health check endpoint at `/api/health`
- Monitor database connections
- Set up uptime monitoring

### Logs
```bash
# PM2 logs
pm2 logs productivity-bingo

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Backups
```bash
# Database backup
pg_dump productivity_bingo > backup_$(date +%Y%m%d).sql

# Restore
psql productivity_bingo < backup_20241201.sql
```

## Performance Optimization

### Next.js Configuration
```javascript
// next.config.js
module.exports = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com'],
  },
  // Enable compression
  compress: true,
  // Enable static optimization
  trailingSlash: false,
}
```

### Database Optimization
- Add indexes for frequently queried fields
- Use connection pooling
- Monitor query performance

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong, unique secrets
   - Rotate secrets regularly

2. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict database access

3. **Application Security**
   - Keep dependencies updated
   - Use HTTPS in production
   - Implement rate limiting

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Verify database is running
   - Check network connectivity

2. **Email Not Sending**
   - Verify email credentials
   - Check SMTP settings
   - Test with different email service

3. **Build Errors**
   - Check Node.js version
   - Clear node_modules and reinstall
   - Verify all environment variables

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev
```

## Support

For deployment issues:
1. Check the logs
2. Verify environment variables
3. Test locally first
4. Check platform-specific documentation

---

**Ready to deploy your Productivity Bingo application! 🚀**
