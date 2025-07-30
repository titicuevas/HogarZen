import React, { ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { AuthHeader } from './AuthHeader'
import { AuthFooter } from './AuthFooter'
import CookieBanner from '../common/CookieBanner'


// =====================================================
// TIPOS
// =====================================================
interface LayoutProps {
  children: ReactNode
  showSidebar?: boolean
  showHeader?: boolean
  showFooter?: boolean
  className?: string
}

// =====================================================
// COMPONENTE LAYOUT PRINCIPAL
// =====================================================
export const Layout: React.FC<LayoutProps> = ({
  children,
  showSidebar = true,
  showHeader = true,
  showFooter = true,
  className = ''
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col ${className}`}>
      {/* Header */}
      {showHeader && <Header />}
      
      {/* Contenido principal */}
      <div className="flex flex-1">
        {/* Sidebar */}
        {showSidebar && <Sidebar />}
        
        {/* Contenido */}
        <main className={`flex-1 ${showSidebar ? 'lg:ml-64' : ''} pt-16 lg:pt-0 min-h-screen`}>
          <div className="p-4 lg:p-6 pb-20 lg:pb-6">
            {children}
          </div>
        </main>
      </div>
      
      {/* Footer */}
      {showFooter && <Footer />}
      
      {/* Cookie Banner */}
      <CookieBanner />
    </div>
  )
}

// =====================================================
// LAYOUT PARA PÁGINAS DE AUTENTICACIÓN
// =====================================================
export const AuthLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-zen-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Header específico para auth */}
      <AuthHeader />
      
      {/* Contenido centrado */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
            {children}
          </div>
        </div>
      </main>
      
      {/* Footer específico para auth */}
      <AuthFooter />
      
      {/* Cookie Banner */}
      <CookieBanner />
    </div>
  )
}

// =====================================================
// LAYOUT PARA PÁGINAS PÚBLICAS
// =====================================================
export const PublicLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
}

// =====================================================
// LAYOUT PARA DASHBOARD
// =====================================================
export const DashboardLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Layout showSidebar={true} showHeader={true} showFooter={true}>
      {children}
    </Layout>
  )
} 