# Production Deployment Guide

## 🚀 Pre-Deployment Checklist

- [ ] Update `ADMIN_PASSWORD` to a strong password
- [ ] Generate strong `JWT_SECRET` (32+ characters)
- [ ] Set `NODE_ENV=production`
- [ ] Update `.env` with production MongoDB URI
- [ ] Test all endpoints with real data
- [ ] Setup HTTPS/TLS certificate
- [ ] Configure database backups
- [ ] Setup monitoring and logging
- [ ] Configure rate limiting
- [ ] Setup CI/CD pipeline

## 🔧 Environment Variables for Production

```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://prod_user:strong_password@cluster.mongodb.net/student-management
JWT_SECRET=generate_a_strong_secret_here_32_chars_minimum
ADMIN_EMAIL=your_admin_email@company.com
ADMIN_PASSWORD=strong_password_for_admin
```

### Generating Strong Secrets

```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Max 256) }))
```

## 📦 Deployment Options

### Option 1: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Option 2: Docker (AWS, GCP, Azure, DigitalOcean)

```bash
# Build image
docker build -t student-api:latest .

# Tag for your registry
docker tag student-api:latest your-registry/student-api:latest

# Push to registry
docker push your-registry/student-api:latest

# Run container
docker run -d \
  -p 3000:3000 \
  -e MONGODB_URI=your_uri \
  -e JWT_SECRET=your_secret \
  -e NODE_ENV=production \
  your-registry/student-api:latest
```

### Option 3: VPS (DigitalOcean, Linode, etc.)

```bash
# SSH into server
ssh root@your_ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo
git clone your_repo
cd student-management-api

# Install dependencies
npm install

# Setup PM2
npm install -g pm2
pm2 start npm --name "student-api" -- start

# Setup auto-restart on reboot
pm2 startup
pm2 save

# Setup Nginx reverse proxy
sudo apt-get install nginx
# Configure nginx to proxy to port 3000
```

### Option 4: AWS EC2

Use the Docker approach above with proper security groups and EBS volumes.

## 🔐 Production Security

### 1. Enable HTTPS
- Use Let's Encrypt (free) for SSL certificates
- Contact your hosting provider for setup

### 2. Setup Rate Limiting
Add this to your `src/index.ts`:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. Setup MongoDB Backups
- Enable automatic backups in MongoDB Atlas
- Test recovery procedures regularly

### 4. Setup Monitoring
- Use PM2 Plus for process monitoring
- Setup error tracking (Sentry, Rollbar)
- Setup uptime monitoring (Pingdom, UptimeRobot)

## 📊 Performance Tips

1. **Enable Redis Caching** (Optional)
2. **Use Content Delivery Network (CDN)** for static files
3. **Setup Database Indexing** on frequently queried fields
4. **Enable Gzip Compression**
5. **Monitor Performance Metrics**

## 🧪 Pre-Production Testing

```bash
# Run health check
curl https://your-api-domain/health

# Test admin login
curl -X POST https://your-api-domain/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your_admin_email",
    "password": "your_admin_password"
  }'

# Load test (with Apache Bench)
ab -n 1000 -c 100 https://your-api-domain/health
```

## 📝 Logging & Monitoring

Add proper logging to your production environment:

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});
```

## 🔄 CI/CD Pipeline Example (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Heroku
        env:
          HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
        run: |
          npm install -g heroku
          heroku login -i
          git push heroku main
```

## 🚨 Troubleshooting Production Issues

### High Memory Usage
- Check for memory leaks with: `node --inspect`
- Use PM2's memory monitoring

### Database Slowness
- Check query performance in MongoDB Atlas
- Add proper indexes
- Analyze slow queries

### API Timeouts
- Check network connectivity
- Verify MongoDB connection
- Check server resources (CPU, RAM)

---

For more information, see [README.md](README.md)
