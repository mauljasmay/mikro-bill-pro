export interface XenditInvoiceParams {
  externalId: string
  amount: number
  description: string
  invoiceDuration?: number
  customer: {
    givenNames: string
    email: string
    mobileNumber?: string
  }
  items?: Array<{
    name: string
    quantity: number
    price: number
    category?: string
  }>
  fees?: Array<{
    type: string
    value: number
  }>
  successRedirectUrl?: string
  failureRedirectUrl?: string
  paymentMethods?: string[]
  currency?: string
  fixedVa?: boolean
  reminderTime?: number
  shouldSendEmail?: boolean
  shouldAuthenticateCustomer?: boolean
  customerNotificationPreference?: {
    invoiceCreated?: string[]
    invoiceReminder?: string[]
    invoicePaid?: string[]
    invoiceExpired?: string[]
  }
}

export interface XenditInvoiceResponse {
  id: string
  externalId: string
  userId: string
  status: string
  merchantName: string
  merchantProfilePictureUrl?: string
  amount: number
  invoiceUrl: string
  expiryDate: string
  description: string
  availableBanks?: Array<{
    bankCode: string
    collectionType: string
    bankBranch: string
    accountHolderName: string
    accountNumber: string
  }>
  availableEwallets?: Array<{
    ewalletType: string
  }>
  availableRetailOutlets?: Array<{
    retailOutletName: string
    paymentCode: string
    transferAmount: number
    merchantName: string
  }>
  shouldExcludeCreditCard: boolean
  user: {
    userId: string
    email: string
    givenNames: string
  }
  created: string
  updated: string
  paidAt?: string
  paidAmount?: number
  paymentMethod?: string
  paymentChannel?: string
  paymentDestination?: string
  feesPaidAmount?: number
  currency: string
}

export interface XenditVirtualAccountParams {
  externalId: string
  bankCode: string
  name: string
  virtualAccountNumber?: string
  description?: string
  expectedAmount?: number
  expirationDate?: string
  isClosed?: boolean
  isSingleUse?: boolean
}

export interface XenditVirtualAccountResponse {
  id: string
  ownerID: string
  externalID: string
  bankCode: string
  merchantCode: string
  name: string
  accountNumber: string
  isClosed: boolean
  isSingleUse: boolean
  status: string
  expirationDate?: string
  expectedAmount?: number
  description?: string
  created: string
  updated: string
}

export interface XenditEwalletParams {
  externalID: string
  phone: string
  amount: number
  ewalletType: 'OVO' | 'DANA' | 'LINKAJA' | 'SHOPEEPAY'
  callbackURL: string
  redirectURL?: string
  items?: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
}

export interface XenditEwalletResponse {
  externalID: string
  phone: string
  ewalletType: string
  amount: number
  status: string
  transactionDate?: string
  checkoutURL?: string
  created: string
  updated: string
}

export class XenditAPI {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string, isProduction: boolean = false) {
    this.apiKey = apiKey
    this.baseUrl = isProduction 
      ? 'https://api.xendit.co' 
      : 'https://api.xendit.co'
  }

  private async makeRequest(
    endpoint: string, 
    method: string = 'GET', 
    data?: any
  ): Promise<any> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const auth = Buffer.from(this.apiKey + ':').toString('base64')
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Xendit API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Xendit API request failed:', error)
      throw error
    }
  }

  // Invoice Methods
  async createInvoice(params: XenditInvoiceParams): Promise<XenditInvoiceResponse> {
    return this.makeRequest('/v2/invoices', 'POST', params)
  }

  async getInvoice(invoiceId: string): Promise<XenditInvoiceResponse> {
    return this.makeRequest(`/v2/invoices/${invoiceId}`)
  }

  async getAllInvoices(params?: {
    statuses?: string[]
    limit?: number
    afterCreatedDate?: string
    beforeCreatedDate?: string
    lastInvoiceId?: string
  }): Promise<XenditInvoiceResponse[]> {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v))
        } else if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    const queryString = queryParams.toString()
    return this.makeRequest(`/v2/invoices${queryString ? `?${queryString}` : ''}`)
  }

  // Virtual Account Methods
  async createFixedVirtualAccount(params: XenditVirtualAccountParams): Promise<XenditVirtualAccountResponse> {
    return this.makeRequest('/callback_virtual_accounts', 'POST', params)
  }

  async getVirtualAccount(virtualAccountId: string): Promise<XenditVirtualAccountResponse> {
    return this.makeRequest(`/callback_virtual_accounts/${virtualAccountId}`)
  }

  async updateVirtualAccount(
    virtualAccountId: string, 
    params: Partial<XenditVirtualAccountParams>
  ): Promise<XenditVirtualAccountResponse> {
    return this.makeRequest(`/callback_virtual_accounts/${virtualAccountId}`, 'PATCH', params)
  }

  // E-wallet Methods
  async createEwalletPayment(params: XenditEwalletParams): Promise<XenditEwalletResponse> {
    return this.makeRequest('/ewallets', 'POST', params)
  }

  async getEwalletStatus(externalID: string, ewalletType: string): Promise<XenditEwalletResponse> {
    return this.makeRequest(`/ewallets?external_id=${externalID}&ewallet_type=${ewalletType}`)
  }

  // Balance Methods
  async getBalance(): Promise<{ balance: number }> {
    return this.makeRequest('/balance')
  }

  // Payout Methods
  async createPayout(params: {
    externalID: string
    amount: number
    email: string
  }): Promise<any> {
    return this.makeRequest('/payouts', 'POST', params)
  }

  // Callback verification
  verifyCallbackToken(token: string): boolean {
    // Verify Xendit callback token
    // This should match the token from Xendit dashboard
    const expectedToken = process.env.XENDIT_CALLBACK_TOKEN
    return token === expectedToken
  }

  // Utility methods
  generateExternalId(prefix: string = 'INV'): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `${prefix}-${timestamp}-${random}`
  }

  formatAmount(amount: number): number {
    // Xendit expects amount in smallest currency unit (e.g., cents for USD)
    // For IDR, it's the full amount
    return Math.round(amount)
  }

  // Payment method validation
  validatePaymentMethod(method: string): boolean {
    const validMethods = [
      'VIRTUAL_ACCOUNT', 'BANK_TRANSFER', 'CREDIT_CARD', 
      'OVO', 'DANA', 'LINKAJA', 'SHOPEEPAY', 'QRIS'
    ]
    return validMethods.includes(method.toUpperCase())
  }

  // Error handling
  handleXenditError(error: any): string {
    if (error.response?.data) {
      const { error_code, message } = error.response.data
      return `Xendit Error (${error_code}): ${message}`
    }
    return error.message || 'Unknown Xendit error occurred'
  }
}

// Singleton instance
let xenditInstance: XenditAPI | null = null

export function getXenditInstance(): XenditAPI {
  if (!xenditInstance) {
    const apiKey = process.env.XENDIT_API_KEY
    if (!apiKey) {
      throw new Error('XENDIT_API_KEY environment variable is not set')
    }
    
    const isProduction = process.env.NODE_ENV === 'production'
    xenditInstance = new XenditAPI(apiKey, isProduction)
  }
  
  return xenditInstance
}

// Payment processing utilities
export class PaymentProcessor {
  private xendit: XenditAPI

  constructor() {
    this.xendit = getXenditInstance()
  }

  async createSubscriptionPayment(
    userId: string,
    subscriptionId: string,
    amount: number,
    description: string,
    customer: {
      name: string
      email: string
      phone?: string
    },
    returnUrl?: string
  ): Promise<XenditInvoiceResponse> {
    const externalId = this.xendit.generateExternalId('SUB')
    
    const params: XenditInvoiceParams = {
      externalId,
      amount: this.xendit.formatAmount(amount),
      description,
      customer: {
        givenNames: customer.name,
        email: customer.email,
        mobileNumber: customer.phone
      },
      successRedirectUrl: returnUrl ? `${returnUrl}?status=success&external_id=${externalId}` : undefined,
      failureRedirectUrl: returnUrl ? `${returnUrl}?status=failed&external_id=${externalId}` : undefined,
      shouldSendEmail: true,
      currency: 'IDR'
    }

    return this.xendit.createInvoice(params)
  }

  async createTopupPayment(
    userId: string,
    amount: number,
    description: string,
    customer: {
      name: string
      email: string
      phone?: string
    },
    returnUrl?: string
  ): Promise<XenditInvoiceResponse> {
    const externalId = this.xendit.generateExternalId('TOPUP')
    
    const params: XenditInvoiceParams = {
      externalId,
      amount: this.xendit.formatAmount(amount),
      description,
      customer: {
        givenNames: customer.name,
        email: customer.email,
        mobileNumber: customer.phone
      },
      items: [
        {
          name: 'Topup Saldo',
          quantity: 1,
          price: this.xendit.formatAmount(amount),
          category: 'Topup'
        }
      ],
      successRedirectUrl: returnUrl ? `${returnUrl}?status=success&external_id=${externalId}` : undefined,
      failureRedirectUrl: returnUrl ? `${returnUrl}?status=failed&external_id=${externalId}` : undefined,
      shouldSendEmail: true,
      currency: 'IDR'
    }

    return this.xendit.createInvoice(params)
  }

  async checkPaymentStatus(externalId: string): Promise<XenditInvoiceResponse | null> {
    try {
      // Get all invoices and find by external ID
      const invoices = await this.xendit.getAllInvoices()
      return invoices.find(invoice => invoice.externalId === externalId) || null
    } catch (error) {
      console.error('Failed to check payment status:', error)
      return null
    }
  }

  async processCallback(callbackData: any): Promise<{
    success: boolean
    externalId: string
    status: string
    amount?: number
    paymentMethod?: string
  }> {
    try {
      const { id, external_id, status, paid_amount, payment_method, payment_channel } = callbackData
      
      return {
        success: true,
        externalId: external_id,
        status: status.toUpperCase(),
        amount: paid_amount,
        paymentMethod: payment_method,
        paymentChannel: payment_channel
      }
    } catch (error) {
      console.error('Failed to process callback:', error)
      return {
        success: false,
        externalId: '',
        status: 'FAILED'
      }
    }
  }
}