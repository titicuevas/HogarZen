// =====================================================
// GESTIÓN DE COOKIES - AUTENTICACIÓN Y SESIÓN
// =====================================================

interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  httpOnly?: boolean;
}

export class CookieManager {
  private static readonly AUTH_TOKEN_KEY = 'hogarzen_auth_token';
  private static readonly USER_DATA_KEY = 'hogarzen_user_data';
  private static readonly SESSION_ID_KEY = 'hogarzen_session_id';
  private static readonly PREFERENCES_KEY = 'hogarzen_preferences';

  /**
   * Establece una cookie con opciones configurables
   */
  static setCookie(name: string, value: string, options: CookieOptions = {}): void {
    const {
      expires,
      maxAge,
      path = '/',
      domain,
      secure = window.location.protocol === 'https:',
      sameSite = 'Lax'
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (expires) {
      cookieString += `; expires=${expires.toUTCString()}`;
    }

    if (maxAge) {
      cookieString += `; max-age=${maxAge}`;
    }

    if (path) {
      cookieString += `; path=${path}`;
    }

    if (domain) {
      cookieString += `; domain=${domain}`;
    }

    if (secure) {
      cookieString += '; secure';
    }

    if (sameSite) {
      cookieString += `; samesite=${sameSite}`;
    }

    document.cookie = cookieString;
  }

  /**
   * Obtiene el valor de una cookie
   */
  static getCookie(name: string): string | null {
    const nameEQ = `${encodeURIComponent(name)}=`;
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }

    return null;
  }

  /**
   * Elimina una cookie
   */
  static deleteCookie(name: string, options: CookieOptions = {}): void {
    const { path = '/', domain } = options;
    
    this.setCookie(name, '', {
      ...options,
      path,
      domain,
      maxAge: -1,
      expires: new Date(0)
    });
  }

  /**
   * Verifica si una cookie existe
   */
  static hasCookie(name: string): boolean {
    return this.getCookie(name) !== null;
  }

  // =====================================================
  // MÉTODOS ESPECÍFICOS PARA AUTENTICACIÓN
  // =====================================================

  /**
   * Guarda el token de autenticación
   */
  static setAuthToken(token: string, rememberMe: boolean = false): void {
    const options: CookieOptions = {
      secure: true,
      sameSite: 'Strict',
      path: '/'
    };

    if (rememberMe) {
      // Token válido por 30 días si "recordar sesión"
      options.maxAge = 30 * 24 * 60 * 60;
    } else {
      // Token válido por la sesión del navegador
      options.maxAge = undefined;
    }

    this.setCookie(this.AUTH_TOKEN_KEY, token, options);
  }

  /**
   * Obtiene el token de autenticación
   */
  static getAuthToken(): string | null {
    return this.getCookie(this.AUTH_TOKEN_KEY);
  }

  /**
   * Elimina el token de autenticación
   */
  static clearAuthToken(): void {
    this.deleteCookie(this.AUTH_TOKEN_KEY, { path: '/' });
  }

  /**
   * Guarda datos del usuario
   */
  static setUserData(userData: any): void {
    const options: CookieOptions = {
      secure: true,
      sameSite: 'Strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 días
    };

    this.setCookie(this.USER_DATA_KEY, JSON.stringify(userData), options);
  }

  /**
   * Obtiene datos del usuario
   */
  static getUserData(): any | null {
    const data = this.getCookie(this.USER_DATA_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Elimina datos del usuario
   */
  static clearUserData(): void {
    this.deleteCookie(this.USER_DATA_KEY, { path: '/' });
  }

  /**
   * Genera y guarda un ID de sesión único
   */
  static setSessionId(): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.setCookie(this.SESSION_ID_KEY, sessionId, {
      secure: true,
      sameSite: 'Strict',
      path: '/'
    });

    return sessionId;
  }

  /**
   * Obtiene el ID de sesión actual
   */
  static getSessionId(): string | null {
    return this.getCookie(this.SESSION_ID_KEY);
  }

  /**
   * Guarda preferencias del usuario
   */
  static setPreferences(preferences: any): void {
    const options: CookieOptions = {
      secure: true,
      sameSite: 'Lax',
      path: '/',
      maxAge: 365 * 24 * 60 * 60 // 1 año
    };

    this.setCookie(this.PREFERENCES_KEY, JSON.stringify(preferences), options);
  }

  /**
   * Obtiene preferencias del usuario
   */
  static getPreferences(): any {
    const data = this.getCookie(this.PREFERENCES_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return {};
      }
    }
    return {};
  }

  /**
   * Limpia todas las cookies de la aplicación
   */
  static clearAll(): void {
    this.clearAuthToken();
    this.clearUserData();
    this.deleteCookie(this.SESSION_ID_KEY, { path: '/' });
    this.deleteCookie(this.PREFERENCES_KEY, { path: '/' });
  }

  /**
   * Verifica si el usuario está autenticado
   */
  static isAuthenticated(): boolean {
    return this.hasCookie(this.AUTH_TOKEN_KEY);
  }

  /**
   * Establece la preferencia "recordarme"
   */
  static setRememberMe(remember: boolean): void {
    this.setCookie('hogarzen_remember_me', remember.toString(), {
      maxAge: remember ? 30 * 24 * 60 * 60 : undefined, // 30 días si es true
      path: '/'
    })
  }

  /**
   * Obtiene la preferencia "recordarme"
   */
  static getRememberMe(): boolean {
    const value = this.getCookie('hogarzen_remember_me')
    return value === 'true'
  }

  /**
   * Limpia la preferencia "recordarme"
   */
  static clearRememberMe(): void {
    this.deleteCookie('hogarzen_remember_me')
  }

  /**
   * Obtiene información de debug de las cookies
   */
  static getDebugInfo(): any {
    return {
      hasAuthToken: this.hasCookie(this.AUTH_TOKEN_KEY),
      hasUserData: this.hasCookie(this.USER_DATA_KEY),
      hasSessionId: this.hasCookie(this.SESSION_ID_KEY),
      hasPreferences: this.hasCookie(this.PREFERENCES_KEY),
      totalCookies: document.cookie.split(';').length
    };
  }
}

// Exportar instancia singleton
export default CookieManager; 