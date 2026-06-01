import { useUserStore } from '@/store/modules/user'
import axios from 'axios'
import mitt from 'mitt'

export const socketEmitter = mitt()

export interface SocketConfig {
  url: string
  pingInterval?: number
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export class SocketService {
  ws: WebSocket | null = null
  private config: SocketConfig
  private pingTimer: any = null
  private reconnectTimer: any = null
  private reconnectAttempts = 0
  private isConnecting = false
  private isManualClose = false
  private channels: string[] = ['finance', 'statistics', 'monitor', 'risk', 'lottery', 'robot']

  constructor(config: SocketConfig) {
    this.config = {
      pingInterval: 30000,
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      ...config
    }
  }

  public connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) return

    const userStore = useUserStore()
    const token = userStore.accessToken

    if (!token) return

    this.isConnecting = true
    this.isManualClose = false

    const wsUrl = new URL(this.config.url)
    wsUrl.searchParams.append('token', token)

    try {
      this.ws = new WebSocket(wsUrl.toString())
      this.initListeners()
    } catch {
      this.handleClose()
    }
  }

  private initListeners() {
    if (!this.ws) return

    this.ws.onopen = () => {
      this.isConnecting = false
      this.reconnectAttempts = 0
      this.sendAuth()
      this.subscribeChannels()
      this.startPing()
    }

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)

        if (msg.type === 'pong') return

        if (msg.type === 'auth_failed') {
          this.handleAuthFailed()
          return
        }

        if (msg.type === 'error' && msg.payload?.message === '请先认证') {
          this.sendAuth()
          return
        }

        if (msg.type) {
          socketEmitter.emit(msg.type, msg.payload)
          socketEmitter.emit('message', msg)
        }
      } catch {
      }
    }

    this.ws.onclose = () => {
      this.handleClose()
    }

    this.ws.onerror = () => {
      this.ws?.close()
    }
  }

  private sendAuth() {
    const userStore = useUserStore()
    this.send({
      type: 'auth',
      payload: { token: userStore.accessToken }
    })
  }

  private async handleAuthFailed() {
    const userStore = useUserStore()
    const refreshTokenValue = userStore.refreshToken
    if (!refreshTokenValue) {
      this.close()
      return
    }
    try {
      const { VITE_API_URL } = import.meta.env
      const res = await axios.post(
        `${VITE_API_URL}/app/admin/account/refreshToken`,
        `refresh_token=${encodeURIComponent(refreshTokenValue)}`,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )
      if (res.data?.code === 0 && res.data?.data?.access_token) {
        userStore.setToken(res.data.data.access_token)
        this.sendAuth()
      } else {
        this.close()
      }
    } catch {
      this.close()
    }
  }

  private subscribeChannels() {
    this.send({
      type: 'subscribe',
      payload: { channels: this.channels }
    })
  }

  public send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  private startPing() {
    this.stopPing()
    this.pingTimer = setInterval(() => {
      this.send({ type: 'ping' })
    }, this.config.pingInterval)
  }

  private stopPing() {
    if (this.pingTimer) {
      clearInterval(this.pingTimer)
      this.pingTimer = null
    }
  }

  private handleClose() {
    this.isConnecting = false
    this.stopPing()

    if (this.isManualClose) return

    if (this.reconnectAttempts < (this.config.maxReconnectAttempts || 0)) {
      const timeout = this.config.reconnectInterval || 5000

      if (this.reconnectTimer) clearTimeout(this.reconnectTimer)

      this.reconnectTimer = setTimeout(() => {
        this.reconnectAttempts++
        this.connect()
      }, timeout)
    }
  }

  public close() {
    this.isManualClose = true
    this.stopPing()
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.ws?.close()
    this.ws = null
  }
}

let instance: SocketService | null = null

export function initWebSocket() {
  if (instance) return instance

  const envUrl = import.meta.env.VITE_WS_URL

  let url = envUrl
  if (!url) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const hostname = window.location.hostname
    url = `${protocol}//${hostname}:8790`
  }

  instance = new SocketService({ url })
  instance.connect()
  return instance
}

export function closeWebSocket() {
  instance?.close()
  instance = null
}

export function isConnected(): boolean {
  return instance?.ws?.readyState === WebSocket.OPEN || false
}
