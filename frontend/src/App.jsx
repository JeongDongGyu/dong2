
import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import DogSearch from './components/DogSearch.jsx'
import DogList from './components/DogLists.jsx'
import DogDetail from './components/DogDetail.jsx'
import AdminEditor from './components/AdminEditor.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-3xl">🐕</span>
                <span className="text-xl font-bold text-gray-900">강아지 사전</span>
              </Link>
              <div className="flex space-x-4">
                <Link to="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  홈
                </Link>
                <Link to="/admin" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  관리자
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path='/' element={
              <>
                <DogSearch />
                <DogList />
              </>
            } />
            <Route path='/dog/:id' element={<DogDetail />} />
            <Route path='/admin' element={<AdminEditor />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
