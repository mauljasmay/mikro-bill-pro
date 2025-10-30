'use client'

import { useState, useEffect } from 'react'
import { 
  Menu, X, ChevronRight, Wifi, Router, CreditCard, Users, Activity, 
  ArrowRight, Mail, Phone, MapPin, CheckCircle, Star, Clock, Award,
  Package, Globe, Shield, Zap, Server, UserPlus, BarChart3, Settings,
  Smartphone, Laptop, Gamepad2, Tv
} from 'lucide-react'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'packages', 'features', 'about', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  const packages = [
    {
      id: 'basic',
      name: 'Basic Package',
      type: 'PPPOE',
      price: 50000,
      duration: 30,
      dataLimit: null, // Unlimited
      speedLimit: '5Mbps/5Mbps',
      features: [
        'Unlimited Data',
        '5 Mbps Speed',
        'PPPoE Connection',
        '24/7 Support',
        'Free Installation'
      ],
      icon: <Smartphone className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      popular: false
    },
    {
      id: 'home',
      name: 'Home Package',
      type: 'PPPOE',
      price: 100000,
      duration: 30,
      dataLimit: null,
      speedLimit: '10Mbps/10Mbps',
      features: [
        'Unlimited Data',
        '10 Mbps Speed',
        'PPPoE Connection',
        '24/7 Support',
        'Free Installation',
        'Static IP Available'
      ],
      icon: <Laptop className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600',
      popular: true
    },
    {
      id: 'gaming',
      name: 'Gaming Package',
      type: 'PPPOE',
      price: 200000,
      duration: 30,
      dataLimit: null,
      speedLimit: '20Mbps/20Mbps',
      features: [
        'Unlimited Data',
        '20 Mbps Speed',
        'Low Latency',
        'Static IP',
        'Priority Support',
        'Free Installation'
      ],
      icon: <Gamepad2 className="w-8 h-8" />,
      color: 'from-red-500 to-red-600',
      popular: false
    },
    {
      id: 'hotspot',
      name: 'Hotspot Package',
      type: 'HOTSPOT',
      price: 25000,
      duration: 7,
      dataLimit: 5000, // 5GB
      speedLimit: '5Mbps/5Mbps',
      features: [
        '5 GB Data Limit',
        '5 Mbps Speed',
        'Hotspot Access',
        'Multi-device Support',
        '7 Days Validity'
      ],
      icon: <Wifi className="w-8 h-8" />,
      color: 'from-green-500 to-green-600',
      popular: false
    },
    {
      id: 'family',
      name: 'Family Package',
      type: 'BOTH',
      price: 300000,
      duration: 30,
      dataLimit: null,
      speedLimit: '50Mbps/50Mbps',
      features: [
        'Unlimited Data',
        '50 Mbps Speed',
        'PPPoE + Hotspot',
        'Multiple Users',
        'Static IP',
        'Priority Support'
      ],
      icon: <Tv className="w-8 h-8" />,
      color: 'from-indigo-500 to-indigo-600',
      popular: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise Package',
      type: 'PPPOE',
      price: 1000000,
      duration: 30,
      dataLimit: null,
      speedLimit: '100Mbps/100Mbps',
      features: [
        'Unlimited Data',
        '100 Mbps Speed',
        'Dedicated Connection',
        'SLA Guarantee',
        '24/7 Premium Support',
        'Free Installation'
      ],
      icon: <Server className="w-8 h-8" />,
      color: 'from-gray-600 to-gray-700',
      popular: false
    }
  ]

  const features = [
    {
      icon: <Router className="w-12 h-12" />,
      title: "Mikrotik Integration",
      description: "Seamless integration with Mikrotik RouterOS for PPPoE and Hotspot management"
    },
    {
      icon: <CreditCard className="w-12 h-12" />,
      title: "Xendit Payment Gateway",
      description: "Multiple payment options including Virtual Account, E-Wallet, and QRIS"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Secure Authentication",
      description: "Advanced security with encrypted connections and user authentication"
    },
    {
      icon: <Activity className="w-12 h-12" />,
      title: "Real-time Monitoring",
      description: "Monitor bandwidth usage, active connections, and system performance"
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Auto Provisioning",
      description: "Automatic user creation and bandwidth management upon payment confirmation"
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "Analytics Dashboard",
      description: "Comprehensive reporting and analytics for business insights"
    }
  ]

  const stats = [
    { number: "1000+", label: "Active Users" },
    { number: "50+", label: "Mikrotik Devices" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ]

  const handlePackageSelect = (pkg: any) => {
    setSelectedPackage(pkg)
    setShowPaymentModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <Router className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MikroBill Pro
                </h1>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {['home', 'packages', 'features', 'about', 'contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === item
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="hidden md:block px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
                Login
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Sign Up
              </button>
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {['home', 'packages', 'features', 'about', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center relative">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5" 
             style={{ backgroundImage: 'url(/hero-bg.jpg)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-100 rounded-full">
                <Router className="w-16 h-16 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Mikrotik Billing &
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Management System
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Complete PPPoE and Hotspot billing solution with Mikrotik RouterOS integration, 
              Xendit payment gateway, and real-time monitoring.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => scrollToSection('packages')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                View Packages
                <Package className="inline-block ml-2 w-5 h-5" />
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-8 py-3 bg-white text-gray-700 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Free Demo
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Internet Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect package for your needs. All packages include 24/7 support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div key={index} className={`relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                pkg.popular ? 'ring-2 ring-purple-500 transform scale-105' : ''
              }`}>
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className={`p-6 bg-gradient-to-br ${pkg.color} text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      {pkg.icon}
                    </div>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      {pkg.type}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold">Rp {pkg.price.toLocaleString('id-ID')}</span>
                    <span className="ml-2 text-white/80">/{pkg.duration} days</span>
                  </div>
                  <div className="text-sm text-white/90">
                    {pkg.speedLimit} • {pkg.dataLimit ? `${pkg.dataLimit}GB` : 'Unlimited'}
                  </div>
                </div>
                
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => handlePackageSelect(pkg)}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                      pkg.popular 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Select Package
                    <ArrowRight className="inline-block ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your ISP business efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose MikroBill Pro?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our comprehensive billing system is designed specifically for ISPs using Mikrotik RouterOS. 
                We provide automated user management, flexible payment options, and real-time monitoring.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: <CheckCircle className="w-5 h-5" />, text: "Automated Mikrotik user provisioning" },
                  { icon: <CheckCircle className="w-5 h-5" />, text: "Multiple payment gateway integration" },
                  { icon: <CheckCircle className="w-5 h-5" />, text: "Real-time bandwidth monitoring" },
                  { icon: <CheckCircle className="w-5 h-5" />, text: "Customer self-service portal" },
                  { icon: <CheckCircle className="w-5 h-5" />, text: "Comprehensive reporting and analytics" },
                  { icon: <CheckCircle className="w-5 h-5" />, text: "Mobile responsive design" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="text-green-600">
                      {item.icon}
                    </div>
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                  <div className="text-gray-600">System Monitoring</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                  <div className="text-gray-600">Uptime Guarantee</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">5min</div>
                  <div className="text-gray-600">Quick Setup</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">100+</div>
                  <div className="text-gray-600">Happy Clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get Started Today
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to transform your ISP business? Contact us for a free demo.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Request Free Demo
              </h3>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your requirements..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Request Demo
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </button>
              </form>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Contact Information
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Email</div>
                      <div className="text-gray-600">info@mikrobillpro.com</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Phone</div>
                      <div className="text-gray-600">+62 21 1234 5678</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Office</div>
                      <div className="text-gray-600">Jakarta, Indonesia</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Business Hours
                </h4>
                <div className="space-y-1 text-gray-600">
                  <div>Monday - Friday: 9:00 AM - 6:00 PM</div>
                  <div>Saturday: 9:00 AM - 3:00 PM</div>
                  <div>Sunday: Closed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Router className="w-8 h-8 text-blue-400" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  MikroBill Pro
                </h3>
              </div>
              <p className="text-gray-400">
                Complete Mikrotik billing and management solution for modern ISPs.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Packages</li>
                <li>Pricing</li>
                <li>Integration</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Support</li>
                <li>Documentation</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Technology</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Mikrotik RouterOS</li>
                <li>Xendit Payment</li>
                <li>Real-time API</li>
                <li>Cloud Hosting</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 MikroBill Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Payment Modal */}
      {showPaymentModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Complete Your Order</h3>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 bg-gradient-to-br ${selectedPackage.color} text-white rounded-lg`}>
                  {selectedPackage.icon}
                </div>
                <div>
                  <h4 className="font-semibold">{selectedPackage.name}</h4>
                  <p className="text-gray-600">{selectedPackage.duration} days • {selectedPackage.speedLimit}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    Rp {selectedPackage.price.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Pay with Virtual Account
              </button>
              <button className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Pay with E-Wallet
              </button>
              <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Pay with QRIS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}