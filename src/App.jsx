import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import NotFoundPage from './pages/NotFound/NotFoundPage'
import DashBoardPage from './pages/dashboard/DashBoardPage'
import DocumentListPage from './pages/Documents/DocumentListPage'
import DocumentDetailPage from './pages/Documents/DocumentDetailPage'
import FlashCardsPage from './pages/FlashCards/FlashCardsPage'
import FlashCardsListPage from './pages/FlashCards/FlashCardsListPage'
import QuizTakePage from './pages/Quizzes/QuizTakePage'
import QuizResultPage from './pages/Quizzes/QuizResultPage'
import ProtectedRoutes from './pages/Auth/ProtectedRoutes'


function App() {
  const isAuthenticated = true
  const loading = false

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <Router>
      <Routes>

        {/* Root */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<DashBoardPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:id" element={<DocumentDetailPage />} />
          <Route path="/flashcards" element={<FlashCardsListPage />} />
          <Route path="/documents/:id/flashcards" element={<FlashCardsPage />} />
          <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
          <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </Router>
  )
}

export default App


