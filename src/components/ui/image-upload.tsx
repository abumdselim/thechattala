"use client"

import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
  folder: 'products' | 'posts' | 'avatars'
  className?: string
}

export function ImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  folder,
  className
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const uploadImage = async (file: File) => {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return null
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('File must be an image')
      return null
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
      return null
    }
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const remainingSlots = maxImages - value.length
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)

    const filesToUpload = Array.from(files).slice(0, remainingSlots)
    const uploadPromises = filesToUpload.map(file => uploadImage(file))
    const urls = await Promise.all(uploadPromises)
    
    const validUrls = urls.filter((url): url is string => url !== null)
    if (validUrls.length > 0) {
      onChange([...value, ...validUrls])
    }

    setUploading(false)
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [value, maxImages])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const removeImage = (index: number) => {
    const newValue = value.filter((_, i) => i !== index)
    onChange(newValue)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      {value.length < maxImages && (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-gray-300",
            uploading && "opacity-50 pointer-events-none"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">
                  Drag & drop images here, or click to select
                </p>
                <p className="text-xs text-muted-foreground">
                  {maxImages - value.length} of {maxImages} images remaining • Max 5MB each
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: JPG, PNG, WebP
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Image Previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {value.map((url, index) => (
            <div
              key={url}
              className="relative aspect-square rounded-lg overflow-hidden border bg-gray-100 group"
            >
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
