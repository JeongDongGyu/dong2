import React, { useState } from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'

export default function AdminEditor() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [adminKey, setAdminKey] = useState('')
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()

  const handleCreate = async () => {
    if (!name.trim()) {
      alert('품종명을 입력해주세요')
      return
    }
    if (!adminKey.trim()) {
      alert('관리자 키를 입력해주세요')
      return
    }

    setCreating(true)
    try {
      const res = await API.post(
        '/api/v1/dogs', 
        { name, description }, 
        { headers: { 'X-Admin-Key': adminKey } }
      )
      alert(`"${res.data.name}" 등록 완료!`)
      setName('')
      setDescription('')
      navigate(`/dog/${res.data.id}`)
    } catch (e) {
      console.error(e)
      alert('등록 실패: ' + (e.response?.data?.detail || e.message))
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">관리자 - 강아지 등록</h2>
          <p className="text-gray-600 mt-1">새로운 강아지 품종을 등록합니다.</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              관리자 키 *
            </label>
            <input 
              type='password'
              placeholder='관리자 키 입력' 
              value={adminKey} 
              onChange={e => setAdminKey(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              품종명 *
            </label>
            <input 
              placeholder='예: 시바견' 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea 
              placeholder='강아지 품종 설명을 입력하세요' 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={handleCreate}
              disabled={creating}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              {creating ? '등록 중...' : '강아지 등록'}
            </button>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
