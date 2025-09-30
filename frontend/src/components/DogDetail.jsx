import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api'
import PhotoUploader from './PhotoUploader.jsx'

export default function DogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [dog, setDog] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const loadDog = async () => {
    setLoading(true)
    try {
      const res = await API.get(`/api/v1/dogs/${id}`)
      setDog(res.data.dog)
      setPhotos(res.data.photos)
    } catch (e) {
      console.error(e)
      alert('강아지 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDog()
  }, [id])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">로딩 중...</p>
      </div>
    )
  }
  
  if (!dog) return <div className="text-center py-12 text-gray-600">강아지를 찾을 수 없습니다.</div>

  return (
    <div>
      <button 
        onClick={() => navigate('/')}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        목록으로
      </button>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">{dog.name}</h1>
        </div>

        <div className="p-8">
          {/* 대표 이미지 */}
          {dog.image_url && (
            <div className="mb-8">
              <img 
                src={`${API.defaults.baseURL}${dog.image_url}`} 
                alt={dog.name}
                className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
              />
            </div>
          )}

          {/* 설명 */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">설명</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {dog.description || '설명이 없습니다.'}
            </p>
          </div>

          {/* 사용자 업로드 사진 갤러리 */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">사용자 업로드 사진</h3>
            
            {photos.length === 0 ? (
              <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
                아직 업로드된 사진이 없습니다.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => setSelectedPhoto(p)}
                    className="aspect-square overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-xl transition transform hover:scale-105"
                  >
                    <img 
                      src={`${API.defaults.baseURL}${p.photo_url}`} 
                      alt='사용자 사진'
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 사진 업로드 */}
          <PhotoUploader dogId={id} onUploaded={loadDog} />
        </div>
      </div>

      {/* 사진 확대 모달 */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={`${API.defaults.baseURL}${selectedPhoto.photo_url}`} 
              alt='확대 사진'
              className="max-w-full max-h-screen rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}
