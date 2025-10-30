import { MikrotikConfig } from '@prisma/client'

export interface MikrotikUser {
  '.id': string
  name: string
  password?: string
  service: string
  profile: string
  uptime?: string
  bytesIn?: string
  bytesOut?: string
  packetsIn?: string
  packetsOut?: string
  dynamic?: boolean
  disabled?: boolean
  comment?: string
}

export interface MikrotikActiveSession {
  '.id': string
  user: string
  address: string
  macAddress: string
  uptime: string
  bytesIn: string
  bytesOut: string
  packetsIn: string
  packetsOut: string
  radius?: boolean
}

export interface MikrotikProfile {
  '.id': string
  name: string
  'rate-limit'?: string
  'parent-queue'?: string
  'only-one'?: string
  'shared-users'?: string
  'add-mac-cookie'?: string
  'mac-cookie-timeout'?: string
}

export class MikrotikAPI {
  private config: MikrotikConfig
  private baseUrl: string

  constructor(config: MikrotikConfig) {
    this.config = config
    const protocol = config.useSSL ? 'https' : 'http'
    this.baseUrl = `${protocol}://${config.host}:${config.port}`
  }

  private async makeRequest(path: string, method: string = 'GET', data?: any): Promise<any> {
    try {
      const url = `${this.baseUrl}/rest${path}`
      const auth = Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64')
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      })

      if (!response.ok) {
        throw new Error(`Mikrotik API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Mikrotik API request failed:', error)
      throw error
    }
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/system/resource')
      return true
    } catch (error) {
      console.error('Mikrotik connection test failed:', error)
      return false
    }
  }

  // Get system info
  async getSystemInfo(): Promise<any> {
    return this.makeRequest('/system/resource')
  }

  // PPPoE Users Management
  async getPPPoEUsers(): Promise<MikrotikUser[]> {
    return this.makeRequest('/ppp/secret')
  }

  async createPPPoEUser(userData: {
    name: string
    password: string
    service: string
    profile: string
    comment?: string
  }): Promise<MikrotikUser> {
    return this.makeRequest('/ppp/secret', 'POST', userData)
  }

  async updatePPPoEUser(id: string, userData: Partial<MikrotikUser>): Promise<MikrotikUser> {
    return this.makeRequest(`/ppp/secret/${id}`, 'PATCH', userData)
  }

  async deletePPPoEUser(id: string): Promise<void> {
    await this.makeRequest(`/ppp/secret/${id}`, 'DELETE')
  }

  async enablePPPoEUser(id: string): Promise<void> {
    await this.makeRequest(`/ppp/secret/${id}/enable`, 'POST')
  }

  async disablePPPoEUser(id: string): Promise<void> {
    await this.makeRequest(`/ppp/secret/${id}/disable`, 'POST')
  }

  // PPPoE Active Connections
  async getPPPoEActive(): Promise<MikrotikActiveSession[]> {
    return this.makeRequest('/ppp/active')
  }

  async disconnectPPPoEUser(id: string): Promise<void> {
    await this.makeRequest(`/ppp/active/${id}`, 'DELETE')
  }

  // Hotspot Users Management
  async getHotspotUsers(): Promise<MikrotikUser[]> {
    return this.makeRequest('/ip/hotspot/user')
  }

  async createHotspotUser(userData: {
    name: string
    password: string
    server?: string
    profile: string
    comment?: string
  }): Promise<MikrotikUser> {
    return this.makeRequest('/ip/hotspot/user', 'POST', userData)
  }

  async updateHotspotUser(id: string, userData: Partial<MikrotikUser>): Promise<MikrotikUser> {
    return this.makeRequest(`/ip/hotspot/user/${id}`, 'PATCH', userData)
  }

  async deleteHotspotUser(id: string): Promise<void> {
    await this.makeRequest(`/ip/hotspot/user/${id}`, 'DELETE')
  }

  // Hotspot Active Users
  async getHotspotActive(): Promise<MikrotikActiveSession[]> {
    return this.makeRequest('/ip/hotspot/active')
  }

  async disconnectHotspotUser(id: string): Promise<void> {
    await this.makeRequest(`/ip/hotspot/active/${id}`, 'DELETE')
  }

  // Profile Management
  async getPPPoEProfiles(): Promise<MikrotikProfile[]> {
    return this.makeRequest('/ppp/profile')
  }

  async getHotspotProfiles(): Promise<MikrotikProfile[]> {
    return this.makeRequest('/ip/hotspot/user/profile')
  }

  // Queue Management (for bandwidth control)
  async getQueues(): Promise<any[]> {
    return this.makeRequest('/queue/simple')
  }

  async createQueue(queueData: {
    name: string
    target: string
    'max-limit'?: string
    'burst-limit'?: string
    'burst-threshold'?: string
    'burst-time'?: string
    comment?: string
  }): Promise<any> {
    return this.makeRequest('/queue/simple', 'POST', queueData)
  }

  async updateQueue(id: string, queueData: Partial<any>): Promise<any> {
    return this.makeRequest(`/queue/simple/${id}`, 'PATCH', queueData)
  }

  async deleteQueue(id: string): Promise<void> {
    await this.makeRequest(`/queue/simple/${id}`, 'DELETE')
  }

  // Get traffic statistics
  async getInterfaceTraffic(interfaceName?: string): Promise<any[]> {
    const path = interfaceName ? `/interface/traffic?id=${interfaceName}` : '/interface/traffic'
    return this.makeRequest(path)
  }

  // Get logs
  async getLogs(topics?: string[]): Promise<any[]> {
    const path = topics ? `/log?topics=${topics.join(',')}` : '/log'
    return this.makeRequest(path)
  }

  // User statistics
  async getUserStatistics(username: string): Promise<any> {
    try {
      // Get PPPoE user info
      const pppoeUsers = await this.getPPPoEUsers()
      const pppoeUser = pppoeUsers.find(user => user.name === username)
      
      // Get active sessions
      const activeSessions = await this.getPPPoEActive()
      const activeSession = activeSessions.find(session => session.user === username)
      
      // Get user queues
      const queues = await this.getQueues()
      const userQueue = queues.find(queue => queue.name.includes(username))
      
      return {
        user: pppoeUser,
        activeSession,
        queue: userQueue,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Failed to get user statistics:', error)
      throw error
    }
  }

  // Batch operations
  async createMultipleUsers(users: Array<{
    name: string
    password: string
    service: string
    profile: string
    comment?: string
  }>): Promise<MikrotikUser[]> {
    const results = []
    for (const user of users) {
      try {
        const result = await this.createPPPoEUser(user)
        results.push(result)
      } catch (error) {
        console.error(`Failed to create user ${user.name}:`, error)
        results.push({ error: error.message, user: user.name })
      }
    }
    return results
  }

  // Sync users from database to Mikrotik
  async syncUsers(users: Array<{
    mikrotikName: string
    mikrotikPassword: string
    profile: string
    disabled: boolean
  }>): Promise<{ success: number; failed: number; errors: string[] }> {
    let success = 0
    let failed = 0
    const errors: string[] = []

    for (const user of users) {
      try {
        const existingUsers = await this.getPPPoEUsers()
        const existingUser = existingUsers.find(u => u.name === user.mikrotikName)

        if (existingUser) {
          // Update existing user
          await this.updatePPPoEUser(existingUser['.id'], {
            password: user.mikrotikPassword,
            profile: user.profile,
            disabled: user.disabled
          })
        } else {
          // Create new user
          await this.createPPPoEUser({
            name: user.mikrotikName,
            password: user.mikrotikPassword,
            service: 'pppoe',
            profile: user.profile
          })
        }
        success++
      } catch (error) {
        failed++
        errors.push(`Failed to sync user ${user.mikrotikName}: ${error.message}`)
      }
    }

    return { success, failed, errors }
  }
}

// Singleton instance for Mikrotik connection
let mikrotikInstance: MikrotikAPI | null = null

export async function getMikrotikConnection(): Promise<MikrotikAPI> {
  if (!mikrotikInstance) {
    const { db } = await import('./db')
    
    // Get active Mikrotik config
    const config = await db.mikrotikConfig.findFirst({
      where: { isActive: true }
    })

    if (!config) {
      throw new Error('No active Mikrotik configuration found')
    }

    mikrotikInstance = new MikrotikAPI(config)
  }

  return mikrotikInstance
}

export async function resetMikrotikConnection(): Promise<void> {
  mikrotikInstance = null
}