import React, { useState } from 'react'
import API from '../api'

export default function PhotoUploader({ dogId, onUploaded }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    
    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      alert('파일을 선택해주세요')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('uploaded_by', 'anonymous')

    setUploading(true)
    try {
      await API.post(`/api/v1/dogs/${dogId}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      alert('사진이 업로드되었습니다!')
      setFile(null)
      setPreview(null)
      if (onUploaded) onUploaded()
    } catch (e) {
      console.error(e)
      alert('업로드 실패: ' + (e.response?.data?.detail || e.message))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
      <h4 className="text-lg font-bold text-gray-900 mb-4">📸 사진 업로드</h4>
      
      {preview && (
        <div className="mb-4">
          <img src={preview} alt="미리보기" className="max-w-xs rounded-lg shadow-md" />
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3">
        <input 
          type='file' 
          accept='image/*' 
          onChange={handleFileChange}
          className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
        />
        <button 
          onClick={handleSubmit} 
          disabled={uploading || !file}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {uploading ? '업로드 중...' : '업로드'}
        </button>
      </div>
    </div>
  )
}
