import React, { useEffect, useState } from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'

export default function DogList() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const fetchDogs = async (search) => {
    setLoading(true)
    try {
      const params = { page, limit }
      if (search) params.search = search
      const res = await API.get('/api/v1/dogs', { params })
      
      // 각 강아지의 첫 번째 사진 가져오기
      const dogsWithPhotos = await Promise.all(
        res.data.items.map(async (dog) => {
          try {
            const detailRes = await API.get(`/api/v1/dogs/${dog.id}`)
            const firstPhoto = detailRes.data.photos && detailRes.data.photos.length > 0 
              ? detailRes.data.photos[0].photo_url 
              : null
            return { ...dog, first_photo: firstPhoto }
          } catch (e) {
            return { ...dog, first_photo: null }
          }
        })
      )
      
      setItems(dogsWithPhotos)
      setTotal(res.data.total)
    } catch (e) {
      console.error(e)
      alert('데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 삭제 함수 추가
const deleteDog = async (dogId, e) => {
  e.stopPropagation();

  if (!window.confirm('정말로 이 강아지를 삭제하시겠습니까?')) return;

  // ① 관리자 키 입력받기 (취소하면 중단)
  const adminKey = window.prompt('관리자 키를 입력하세요');
  if (adminKey == null || adminKey.trim() === '') return;

  try {
    // ② 헤더에 X-Admin-Key 추가
    await API.delete(`/api/v1/dogs/${dogId}`, {
      headers: { 'X-Admin-Key': adminKey.trim() }
    });
    alert('삭제되었습니다.');
    fetchDogs(searchQuery);
  } catch (error) {
    console.error(error);
    alert('삭제에 실패했습니다.');
  }
};

  useEffect(() => {
    fetchDogs(searchQuery)
  }, [page])

  useEffect(() => {
    const handleSearch = (e) => {
      setSearchQuery(e.detail.q)
      setPage(1)
      fetchDogs(e.detail.q)
    }
    window.addEventListener('dog-search', handleSearch)
    return () => window.removeEventListener('dog-search', handleSearch)
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">강아지 목록</h2>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">로딩 중...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(d => (
              <div 
                key={d.id} 
                onClick={() => navigate(`/dog/${d.id}`)} 
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1"
              >
                {/* 대표 이미지 */}
                <div className="h-48 bg-gray-200 overflow-hidden">
                  {d.first_photo ? (
                    <img 
                      src={`${API.defaults.baseURL}${d.first_photo}`} 
                      alt={d.name}
                      className="w-full h-full object-cover"
                    />
                  ) : d.image_url ? (
                    <img 
                      src={`${API.defaults.baseURL}${d.image_url}`} 
                      alt={d.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🐕
                    </div>
                  )}
                </div>
                
                {/* 정보 */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{d.name}</h3>
                    <button
                      onClick={(e) => deleteDog(d.id, e)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                      title="삭제"
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {d.description || '설명이 없습니다.'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <div className="text-sm text-gray-700">
              총 <span className="font-medium">{total}</span>개 | 
              페이지 <span className="font-medium">{page}</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={page * limit >= total}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
