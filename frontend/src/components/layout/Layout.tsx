import React, { ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'

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
    <div className={`min-h-screen bg-gray-50 flex flex-col ${className}`}>
      {/* Header */}
      {showHeader && <Header />}
      
      {/* Contenido principal */}
      <div className="flex flex-1">
        {/* Sidebar */}
        {showSidebar && <Sidebar />}
        
        {/* Contenido */}
        <main className={`flex-1 ${showSidebar ? 'ml-64' : ''}`}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
      
      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  )
}

// =====================================================
// LAYOUT PARA PÁGINAS DE AUTENTICACIÓN
// =====================================================
export const AuthLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-zen-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}

// =====================================================
// LAYOUT PARA PÁGINAS PÚBLICAS
// =====================================================
export const PublicLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
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
    <Layout showSidebar={true} showHeader={true} showFooter={false}>
      {children}
    </Layout>
  )
} 