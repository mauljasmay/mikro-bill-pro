# MikroBill Pro - Mikrotik Billing & Management System

Complete PPPoE and Hotspot billing solution with Mikrotik RouterOS integration, Xendit payment gateway, and real-time monitoring.

## 🚀 Features

### Core Features
- **Mikrotik RouterOS Integration** - Seamless integration with Mikrotik devices
- **PPPoE & Hotspot Management** - Automated user provisioning and management
- **Xendit Payment Gateway** - Multiple payment methods (VA, E-Wallet, QRIS)
- **Real-time Monitoring** - Bandwidth usage and connection monitoring
- **Automated Provisioning** - Auto-create users upon payment confirmation
- **Customer Self-Service** - Portal for customers to manage their accounts

### Admin Features
- **Dashboard Analytics** - Comprehensive business insights
- **User Management** - Manage customers and subscriptions
- **Package Management** - Create and configure internet packages
- **Transaction History** - Track all payments and transactions
- **System Monitoring** - Real-time system health monitoring
- **Mikrotik Configuration** - Easy RouterOS setup and management

## 🛠 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production)
- **Payment**: Xendit Payment Gateway
- **Infrastructure**: Mikrotik RouterOS API

## 🐧 Ubuntu 22.04 Installation Guide

### Prerequisites
- Ubuntu 22.04 LTS Server/Desktop
- Minimum 2GB RAM, 20GB Storage
- Internet connection
- sudo/administrator access
- Mikrotik RouterOS device
- Xendit account (for payment processing)

---

### Step 1: System Update & Basic Dependencies

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential build tools
sudo apt install -y build-essential curl wget git unzip software-properties-common \
    apt-transport-https ca-certificates gnupg lsb-release

# Install Node.js 18.x (Recommended)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x
```

---

### Step 2: Install Database (SQLite for Development)

```bash
# Install SQLite3 and development tools
sudo apt install -y sqlite3 libsqlite3-dev

# Verify SQLite installation
sqlite3 --version
```

**For Production (PostgreSQL - Optional but Recommended):**
```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE mikrobill_pro;
CREATE USER mikrobill_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE mikrobill_pro TO mikrobill_user;
\q
```

---

### Step 3: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify PM2 installation
pm2 --version
```

---

### Step 4: Install Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Allow Nginx through firewall
sudo ufw allow 'Nginx Full'
```

---

### Step 5: Install SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate (replace yourdomain.com)
sudo certbot --nginx -d yourdomain.com
```

---

### Step 6: Clone and Setup MikroBill Pro

```bash
# Create application directory
sudo mkdir -p /var/www/mikrobill-pro
sudo chown $USER:$USER /var/www/mikrobill-pro
cd /var/www/mikrobill-pro

# Clone the repository
git clone https://github.com/mauljasmay/mikro-bill-pro.git .

# Install Node.js dependencies
npm install

# Setup environment variables
cp .env.example .env.local
nano .env.local  # Edit with your configuration
```

---

### Step 7: Configure Environment Variables

Edit `.env.local` with your actual configuration:

```env
# Database
DATABASE_URL="file:./dev.db"
# For PostgreSQL production: "postgresql://mikrobill_user:your_secure_password@localhost:5432/mikrobill_pro"

# NextAuth.js Configuration
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-very-secure-secret-key-here-min-32-chars"

# Xendit Payment Gateway
XENDIT_SECRET_KEY="xnd_development_your-secret-key-here"
XENDIT_API_KEY="xnd_development_your-api-key-here"
XENDIT_WEBHOOK_TOKEN="your-webhook-token-here"

# Mikrotik RouterOS Configuration
MIKROTIK_HOST="192.168.88.1"
MIKROTIK_USERNAME="admin"
MIKROTIK_PASSWORD="your-mikrotik-password"
MIKROTIK_PORT="8728"
MIKROTIK_USE_SSL="false"

# Application Settings
APP_NAME="MikroBill Pro"
APP_URL="https://yourdomain.com"
ADMIN_EMAIL="admin@yourdomain.com"

# Email Configuration (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Production
NODE_ENV="production"
```

---

### Step 8: Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# (Optional) Seed database with sample data
npx prisma db seed
```

---

### Step 9: Create Default Packages

```bash
# Create default internet packages
curl -X POST http://localhost:3000/api/setup/packages
```

---

### Step 10: Configure Nginx

Create Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/mikrobill-pro
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/mikrobill-pro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### Step 11: Start Application with PM2

```bash
# Start the application
pm2 start npm --name "mikrobill-pro" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

---

### Step 12: Configure Firewall

```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

### Step 13: Setup Log Rotation

```bash
# Create log rotation configuration
sudo nano /etc/logrotate.d/mikrobill-pro
```

Add the following:
```
/var/www/mikrobill-pro/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}
```

---

## 📋 System Requirements Summary

### Minimum Requirements:
- **OS**: Ubuntu 22.04 LTS
- **RAM**: 2GB (4GB recommended)
- **Storage**: 20GB (50GB recommended)
- **CPU**: 2 cores (4 cores recommended)
- **Network**: Stable internet connection

### Software Dependencies:
- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **SQLite3** (development) or **PostgreSQL** (production)
- **Nginx** (reverse proxy)
- **PM2** (process manager)
- **Git** (version control)

### Optional Components:
- **PostgreSQL** (for production database)
- **Let's Encrypt** (SSL certificates)
- **UFW** (firewall configuration)

---

## 🔧 Mikrotik Setup

### 1. Enable API Service
```bash
# Via WinBox or Terminal
# Go to IP → Services
# Enable API service (default port 8728)
# Set allowed IP addresses or 0.0.0.0/0 for all IPs
```

### 2. Create User Profiles
```bash
# Via WinBox or Terminal
# Go to PPP → Profiles
# Create profiles matching your packages (basic, home, gaming, etc.)
# Set appropriate rate limits and data limits
```

### 3. Configure API User
```bash
# Via WinBox or Terminal
# Go to System → Users
# Create user with API access
# Assign appropriate permissions
```

---

## 🔧 Xendit Setup

### 1. Create Xendit Account
- Register at [xendit.co](https://xendit.co)
- Get your API key from dashboard

### 2. Configure Callback URL
- Set callback URL: `https://yourdomain.com/api/payments/xendit/callback`
- Set webhook token for security

---

## 📊 API Endpoints

### Public APIs
- `GET /api/packages` - Get available packages
- `POST /api/subscriptions` - Create subscription
- `POST /api/payments/xendit/callback` - Payment callback

### Admin APIs
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/mikrotik/users` - Get Mikrotik users
- `POST /api/mikrotik/test` - Test Mikrotik connection

---

## 🎯 Usage

### For Customers
1. Browse available packages on the homepage
2. Select a package and click "Select Package"
3. Choose payment method (Virtual Account, E-Wallet, QRIS)
4. Complete payment
5. Receive credentials via email
6. Connect using PPPoE or Hotspot

### For Administrators
1. Access admin panel at `/admin`
2. Configure Mikrotik connection
3. Create and manage packages
4. Monitor users and transactions
5. View analytics and reports

---

## 🔧 Maintenance Commands

### Application Management
```bash
# View application status
pm2 status

# View logs
pm2 logs mikrobill-pro

# Restart application
pm2 restart mikrobill-pro

# Update application
cd /var/www/mikrobill-pro
git pull
npm install
npx prisma generate
npx prisma db push
pm2 restart mikrobill-pro
```

### Database Management
```bash
# Backup SQLite database
cp /var/www/mikrobill-pro/prisma/dev.db /var/www/mikrobill-pro/backups/dev-$(date +%Y%m%d).db

# Backup PostgreSQL
sudo -u postgres pg_dump mikrobill_pro > /var/www/mikrobill-pro/backups/postgres-$(date +%Y%m%d).sql
```

---

## 🔒 Security

- API authentication with JWT tokens
- Xendit callback verification
- Input validation and sanitization
- HTTPS enforcement with SSL certificates
- Database encryption for sensitive data
- Firewall configuration
- Regular security updates

---

## 📈 Monitoring

The system provides real-time monitoring for:
- Active user connections
- Bandwidth usage
- Payment transactions
- System health
- Mikrotik device status

### Monitoring Commands
```bash
# Check system resources
htop
df -h
free -h

# Check application logs
pm2 logs mikrobill-pro --lines 100

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🚀 Deployment

### Development Mode
```bash
cd /var/www/mikrobill-pro
npm run dev
```

### Production Mode
```bash
cd /var/www/mikrobill-pro
npm run build
pm2 start npm --name "mikrobill-pro" -- start
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support & Troubleshooting

### Common Issues:

1. **Port 3000 already in use**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **Database connection failed**
   ```bash
   # Check database file permissions
   ls -la /var/www/mikrobill-pro/prisma/dev.db
   
   # Regenerate Prisma client
   npx prisma generate
   npx prisma db push
   ```

3. **Mikrotik connection failed**
   ```bash
   # Test connection from server
   telnet <MIKROTIK_IP> 8728
   
   # Check firewall settings
   sudo ufw status
   ```

4. **Nginx 502 Bad Gateway**
   ```bash
   # Check if application is running
   pm2 status
   
   # Restart Nginx
   sudo systemctl restart nginx
   ```

### Get Support:
- Email: info@mikrobillpro.com
- Documentation: [docs.mikrobillpro.com](https://docs.mikrobillpro.com)
- Issues: [GitHub Issues](https://github.com/mauljasmay/mikro-bill-pro/issues)

---

## 🔄 Updates

- **Version 1.0.0** - Initial release with core billing features
- **Version 1.1.0** - Added real-time monitoring
- **Version 1.2.0** - Enhanced payment options
- **Version 2.0.0** - Mobile app support (planned)

---

**Built with ❤️ for ISP businesses | Compatible with Ubuntu 22.04 LTS**