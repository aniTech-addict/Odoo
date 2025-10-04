import './App.css'
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Import existing pages
import CareerGuidanceLanding from './Pages/CareerGuidanceLanding'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Approvals from './Pages/Approvals'
import UserManagement from './Pages/UserManagement'

// Import new expense management pages (to be created)
import Dashboard from './Pages/Dashboard'
import ExpenseList from './Pages/ExpenseList'
import ExpenseForm from './Pages/ExpenseForm'
import CategoryManagement from './Pages/CategoryManagement'
import Profile from './Pages/Profile'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<CareerGuidanceLanding />} />
            <Route path="/landing" element={<CareerGuidanceLanding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/expenses" element={
              <ProtectedRoute>
                <ExpenseList />
              </ProtectedRoute>
            } />

            <Route path="/expenses/new" element={
              <ProtectedRoute>
                <ExpenseForm />
              </ProtectedRoute>
            } />

            <Route path="/expenses/:id/edit" element={
              <ProtectedRoute>
                <ExpenseForm />
              </ProtectedRoute>
            } />

            <Route path="/approvals" element={
              <ProtectedRoute>
                <Approvals />
              </ProtectedRoute>
            } />

            <Route path="/categories" element={
              <ProtectedRoute requiredRole="admin">
                <CategoryManagement />
              </ProtectedRoute>
            } />

            <Route path="/users" element={
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* Catch all route - redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
