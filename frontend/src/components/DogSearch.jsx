
import React, { useState } from 'react'

export default function DogSearch() {
  const [q, setQ] = useState('')

  const search = () => {
    window.dispatchEvent(new CustomEvent('dog-search', { detail: { q } }))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      search()
    }
  }

  return (
    <div className="mb-8">
      <div className="flex gap-2">
        <input 
          value={q} 
          onChange={e => setQ(e.target.value)} 
          onKeyPress={handleKeyPress}
          placeholder='품종명 또는 설명 검색'
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button 
          onClick={search}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          검색
        </button>
      </div>
    </div>
  )
}
