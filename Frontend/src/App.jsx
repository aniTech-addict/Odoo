import './App.css'

import React, { useState } from 'react'
import CareerGuidanceLanding from './Pages/CareerGuidanceLanding'
import Login from './Pages/Login'
import Signup from './Pages/Signup'

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing') // 'landing', 'login', 'signup'

  const renderPage = () => {
    switch(currentPage) {
      case 'login':
        return <Login onNavigate={setCurrentPage} />
      case 'signup':
        return <Signup onNavigate={setCurrentPage} />
      default:
        return <CareerGuidanceLanding onNavigate={setCurrentPage} />
    }
  }

  return (
    <>
      {renderPage()}

      {/* Development Navigation Helper - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50 bg-white border-2 border-gray-900 rounded-lg p-2 shadow-lg">
          <div className="text-xs font-semibold mb-2 text-gray-900">Dev Navigation:</div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage('landing')}
              className={`px-2 py-1 text-xs rounded ${currentPage === 'landing' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Landing
            </button>
            <button
              onClick={() => setCurrentPage('login')}
              className={`px-2 py-1 text-xs rounded ${currentPage === 'login' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Login
            </button>
            <button
              onClick={() => setCurrentPage('signup')}
              className={`px-2 py-1 text-xs rounded ${currentPage === 'signup' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Signup
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default App
