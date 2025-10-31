# Mikrotik Connection Setup Guide

## 🔧 Problem Solved
The "Connection failed - unable to reach Mikrotik device" error has been resolved by:
1. Creating a default Mikrotik configuration in the database
2. Adding support for IP public and hostname connections
3. Enhanced SSL/TLS configuration for secure public connections
4. Adding comprehensive configuration management in the admin panel
5. Improving error handling and user feedback

## 📋 Current Configuration
A default Mikrotik configuration has been created with:
- **Host**: mikrotik.yourdomain.com (Default hostname for public access)
- **Port**: 8729 (Default SSL API port)
- **Username**: admin
- **Password**: admin
- **SSL**: Enabled (Recommended for public connections)

## 🌐 Konfigurasi untuk IP Public/Hostname

### 1. Access Admin Dashboard
- Go to `/admin` in your browser
- No login required (disabled)

### 2. Navigate to Mikrotik Settings
- Click on "Mikrotik" in the sidebar
- You'll see the configuration form with public defaults

### 3. Update Configuration for Public Access
Fill in your Mikrotik details:
- **Host/IP Address atau Hostname**: 
  - Gunakan hostname: `mikrotik.yourdomain.com`
  - Atau IP public: `203.x.x.x`
  - Atau DDNS: `your-router.ddns.net`
- **Port API**: 
  - **8729** untuk HTTPS (disarankan untuk public)
  - **8728** untuk HTTP (hanya jaringan lokal)
- **Username**: Mikrotik API username
- **Password**: Mikrotik API password
- **Gunakan SSL/TLS**: ✅ Aktifkan untuk IP public

### 4. Test Connection
- Click "Test Connection" to verify connectivity
- You'll see detailed success/failure message with protocol info

### 5. Save Configuration
- Click "Save Configuration" to store settings
- Configuration will be used for all Mikrotik operations

## 🔍 Mikrotik Requirements untuk Public Access

### Enable REST API dengan SSL
```bash
# Di Terminal Mikrotik
/ip service set api address=0.0.0.0/0 port=8729 disabled=no certificate=api-cert

# Generate SSL Certificate (jika belum ada)
/certificate add name=api-cert common-name=mikrotik.yourdomain.com
/certificate sign api-cert
/ip service set api certificate=api-cert
```

### Atau via WinBox/WebFig:
1. **IP** → **Services**
2. **API Service**:
   - Port: 8729
   - Address: 0.0.0.0/0 (semua IP)
   - Certificate: Pilih SSL certificate
   - TLS Version: v1.2 minimum
   - Disabled: No

### Create API User (Recommended)
```bash
# Create dedicated API user
/user add name=apiuser password=StrongPassword123 group=full
/ip service set api address=0.0.0.0/0 port=8729
```

## 🔥 Firewall Configuration untuk Public Access

### Basic Firewall Rules
```bash
# Allow API dari IP server tertentu (recommended)
/ip firewall filter add chain=input protocol=tcp dst-port=8729 src-address=YOUR_SERVER_IP action=accept comment="Allow API from server"

# Atau allow dari semua (less secure)
/ip firewall filter add chain=input protocol=tcp dst-port=8729 action=accept comment="Allow API"

# Block brute force attempts
/ip firewall filter add chain=input protocol=tcp dst-port=8729 connection-state=new src-address-list=api_blacklist action=drop

# Add to blacklist setelah 3 attempts
/ip firewall raw add action=add-src-to-address-list address-list=api_blacklist address-list-timeout=1d chain=prerouting dst-port=8729 protocol=tcp src-address-list=api_attempts stage=dst-limit3,3,30

/ip firewall raw add action=add-src-to-address-list address-list=api_attempts address-list-timeout=1m chain=prerouting dst-port=8729 protocol=tcp stage=dst-limit3,3,30
```

## 🛠️ Troubleshooting Public Connections

### Connection Issues
1. **Check Hostname Resolution**: 
   - `ping mikrotik.yourdomain.com`
   - `nslookup mikrotik.yourdomain.com`
2. **Check Port**: 
   - `telnet mikrotik.yourdomain.com 8729`
   - Use online port checker tools
3. **Check SSL Certificate**: 
   - Verify certificate is valid
   - Check certificate chain
4. **Check Firewall**: 
   - Port 8729 harus terbuka
   - Allow dari IP server aplikasi

### SSL/TLS Issues
1. **Certificate Valid**: Pastikan certificate tidak expired
2. **Certificate Chain**: Complete certificate chain
3. **Hostname Match**: Certificate harus match dengan hostname
4. **TLS Version**: Gunakan TLS 1.2+

### Authentication Issues
1. **Verify Credentials**: Check username and password
2. **User Permissions**: Ensure user has API access
3. **Group Rights**: User should have sufficient permissions

## 📊 Features Available dengan Public Connection

Once connected, you can:
- View PPPoE/Hotspot users remotely
- Create/manage user accounts
- Monitor active connections
- Manage bandwidth queues
- View traffic statistics
- Sync users from database
- Remote management dari lokasi manapun

## 🔐 Security Best Practices untuk Public Access

1. **Use Strong Passwords**: Create dedicated API user with strong password
2. **Limit IP Access**: Restrict API access to specific IP addresses
3. **Always Use SSL**: Enable SSL/TLS untuk semua public connections
4. **Valid Certificate**: Use proper SSL certificate (Let's Encrypt atau commercial)
5. **Regular Updates**: Keep Mikrotik firmware updated
6. **Monitor Logs**: Monitor API access logs
7. **Rate Limiting**: Implement rate limiting untuk mencegah brute force

## 📞 Support

If you still experience issues with public connections:
1. Check Mikrotik logs: `/log print where topics~"api"`
2. Verify API service: `/ip service print`
3. Test with curl: `curl -k https://mikrotik.yourdomain.com:8729/rest/system/resource`
4. Check network connectivity and firewall
5. Verify SSL certificate: `openssl s_client -connect mikrotik.yourdomain.com:8729`

## 🎯 Quick Setup Checklist

- [ ] Enable REST API di Mikrotik (port 8729)
- [ ] Generate/setup SSL certificate
- [ ] Create dedicated API user
- [ ] Configure firewall rules
- [ ] Test connection dari server aplikasi
- [ ] Update configuration di admin panel
- [ ] Test dan save configuration
- [ ] Verify semua features berjalan

The system is now ready to connect to your Mikrotik device via IP public atau hostname! 🎉

## 🌟 Additional Tips

1. **DDNS**: Gunakan DDNS jika IP public berubah
2. **Backup**: Regular backup Mikrotik configuration
3. **Monitoring**: Monitor API usage dan performance
4. **Documentation**: Document semua perubahan konfigurasi