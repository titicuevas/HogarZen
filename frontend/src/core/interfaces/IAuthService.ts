// =====================================================
// INTERFACE SEGREGATION PRINCIPLE - AUTH SERVICE
// =====================================================

import { LoginFormData, RegisterFormData, AuthResponse, User } from '../../shared/types'

/**
 * Interfaz para operaciones de autenticación básicas
 */
export interface IAuthService {
  signIn(credentials: LoginFormData): Promise<AuthResponse>
  signUp(userData: RegisterFormData): Promise<AuthResponse>
  signOut(): Promise<AuthResponse>
  getCurrentUser(): Promise<User | null>
  validateToken(): Promise<AuthResponse>
  refreshToken(): Promise<AuthResponse>
}

/**
 * Interfaz para operaciones de gestión de usuarios
 */
export interface IUserService {
  updateUser(userId: string, updates: Partial<User>): Promise<AuthResponse>
  deleteUser(userId: string): Promise<AuthResponse>
  getUserProfile(userId: string): Promise<User | null>
}

/**
 * Interfaz para operaciones de validación
 */
export interface IAuthValidator {
  validateCredentials(email: string, password: string): Promise<boolean>
  validateEmail(email: string): boolean
  validatePassword(password: string): boolean
}

/**
 * Interfaz para operaciones de persistencia
 */
export interface IAuthStorage {
  saveAuthToken(token: string): void
  getAuthToken(): string | null
  removeAuthToken(): void
  saveUserData(user: User): void
  getUserData(): User | null
  removeUserData(): void
  clearAll(): void
}

/**
 * Interfaz para operaciones de sesión
 */
export interface ISessionManager {
  initializeSession(): Promise<void>
  clearSession(): Promise<void>
  isSessionValid(): Promise<boolean>
  refreshSession(): Promise<void>
} 