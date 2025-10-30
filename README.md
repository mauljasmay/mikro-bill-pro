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

## 📋 Prerequisites

- Node.js 18+ 
- Mikrotik RouterOS device
- Xendit account (for payment processing)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mikrobill-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration. See [.env.example](.env.example) for all available variables:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Xendit Payment Gateway
   XENDIT_SECRET_KEY="xnd_development_your-secret-key-here"
   XENDIT_API_KEY="xnd_development_your-api-key-here"
   XENDIT_WEBHOOK_TOKEN="your-webhook-token-here"
   
   # Mikrotik Configuration
   MIKROTIK_HOST="192.168.88.1"
   MIKROTIK_USERNAME="admin"
   MIKROTIK_PASSWORD="your-password"
   MIKROTIK_PORT="8728"
   MIKROTIK_USE_SSL="false"
   ```

4. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Create default packages**
   ```bash
   curl -X POST http://localhost:3000/api/setup/packages
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   │   ├── admin/         # Admin APIs
│   │   ├── mikrotik/      # Mikrotik integration
│   │   ├── packages/      # Package management
│   │   ├── payments/      # Payment processing
│   │   └── subscriptions/ # Subscription management
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── lib/                   # Utility libraries
│   ├── db.ts             # Database client
│   ├── mikrotik.ts       # Mikrotik API wrapper
│   └── xendit.ts         # Xendit payment wrapper
├── prisma/                # Database schema
│   └── schema.prisma     # Prisma schema
└── public/                # Static assets
```

## 🔧 Configuration

### Mikrotik Setup

1. **Enable API Service**
   - Login to your Mikrotik via WinBox or Terminal
   - Go to IP → Services
   - Enable API service (default port 8728)
   - Set allowed IP addresses or 0.0.0.0/0 for all IPs

2. **Create User Profiles**
   - Go to PPP → Profiles
   - Create profiles matching your packages (basic, home, gaming, etc.)
   - Set appropriate rate limits and data limits

3. **Configure API User**
   - Go to System → Users
   - Create user with API access
   - Assign appropriate permissions

### Xendit Setup

1. **Create Xendit Account**
   - Register at [xendit.co](https://xendit.co)
   - Get your API key from dashboard

2. **Configure Callback URL**
   - Set callback URL: `https://yourdomain.com/api/payments/xendit/callback`
   - Set webhook token for security

## 📊 API Endpoints

### Public APIs
- `GET /api/packages` - Get available packages
- `POST /api/subscriptions` - Create subscription
- `POST /api/payments/xendit/callback` - Payment callback

### Admin APIs
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/mikrotik/users` - Get Mikrotik users
- `POST /api/mikrotik/test` - Test Mikrotik connection

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

## 🔒 Security

- API authentication with JWT tokens
- Xendit callback verification
- Input validation and sanitization
- HTTPS enforcement in production
- Database encryption for sensitive data

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Docker
```bash
docker build -t mikrobill-pro .
docker run -p 3000:3000 mikrobill-pro
```

### Traditional Server
```bash
npm run build
npm start
```

## 📈 Monitoring

The system provides real-time monitoring for:
- Active user connections
- Bandwidth usage
- Payment transactions
- System health
- Mikrotik device status

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: info@mikrobillpro.com
- Documentation: [docs.mikrobillpro.com](https://docs.mikrobillpro.com)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

## 🔄 Updates

- Version 1.0.0 - Initial release with core billing features
- Version 1.1.0 - Added real-time monitoring
- Version 1.2.0 - Enhanced payment options
- Version 2.0.0 - Mobile app support (planned)

---

**Built with ❤️ for ISP businesses**