import React from 'react';
import ChatInterface from '../components/chatbot/ChatInterface';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Help: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Centro de Ayuda
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Asistente virtual inteligente
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-[calc(100vh-12rem)]">
          <ChatInterface />
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿No encuentras lo que buscas? Contacta con nosotros en{' '}
              <a
                href="mailto:hola@hogarzen.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                hola@hogarzen.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help; 