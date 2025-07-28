// =====================================================
// DOMAIN ENTITY - USER
// =====================================================

export interface UserSettings {
  theme: 'light' | 'dark'
  notifications: boolean
  language: string
  timezone: string
  demo_mode?: boolean
}

export interface UserProfile {
  name: string
  email: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
}

/**
 * Entidad de dominio para Usuario
 */
export class User {
  public readonly id: string
  public readonly email: string
  public readonly name: string
  public readonly zone: string
  public readonly settings: UserSettings
  public readonly profile: UserProfile
  public readonly created_at: string
  public readonly updated_at: string

  constructor(data: {
    id: string
    email: string
    name: string
    zone?: string
    settings?: Partial<UserSettings>
    profile?: Partial<UserProfile>
    created_at?: string
    updated_at?: string
  }) {
    this.id = data.id
    this.email = data.email
    this.name = data.name
    this.zone = data.zone || 'default'
    this.settings = {
      theme: 'light',
      notifications: true,
      language: 'es',
      timezone: 'UTC',
      ...data.settings
    }
    this.profile = {
      name: data.name,
      email: data.email,
      ...data.profile
    }
    this.created_at = data.created_at || new Date().toISOString()
    this.updated_at = data.updated_at || new Date().toISOString()
  }

  /**
   * Valida si el usuario es válido
   */
  public isValid(): boolean {
    return !!(
      this.id &&
      this.email &&
      this.name &&
      this.isValidEmail(this.email)
    )
  }

  /**
   * Valida formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Actualiza la configuración del usuario
   */
  public updateSettings(updates: Partial<UserSettings>): User {
    return new User({
      ...this,
      settings: { ...this.settings, ...updates },
      updated_at: new Date().toISOString()
    })
  }

  /**
   * Actualiza el perfil del usuario
   */
  public updateProfile(updates: Partial<UserProfile>): User {
    return new User({
      ...this,
      profile: { ...this.profile, ...updates },
      updated_at: new Date().toISOString()
    })
  }

  /**
   * Verifica si el usuario está en modo demo
   */
  public isDemoUser(): boolean {
    return this.settings.demo_mode === true
  }

  /**
   * Obtiene el nombre para mostrar
   */
  public getDisplayName(): string {
    return this.profile.name || this.name
  }

  /**
   * Convierte a objeto plano
   */
  public toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      zone: this.zone,
      settings: this.settings,
      profile: this.profile,
      created_at: this.created_at,
      updated_at: this.updated_at
    }
  }

  /**
   * Crea una instancia desde objeto plano
   */
  public static fromJSON(data: any): User {
    return new User(data)
  }

  /**
   * Crea un usuario demo
   */
  public static createDemoUser(): User {
    return new User({
      id: 'demo-user-id',
      email: 'demo@demo.es',
      name: 'Usuario Demo',
      settings: {
        theme: 'light',
        notifications: true,
        language: 'es',
        timezone: 'UTC',
        demo_mode: true
      }
    })
  }
} 