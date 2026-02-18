'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ImageUpload } from '@/components/ui/image-upload'
import { updateProfile, updateAvatar } from '@/app/actions/user'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { User as UserIcon } from 'lucide-react'

type ProfileFormData = {
  name: string
  email: string
}

export function ProfileForm({ profile }: { profile: any }) {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(profile.image || '')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: profile.name || '',
      email: profile.email || '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile({
        name: data.name,
      })
      toast.success('Profile updated successfully')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    }
  }

  const handleImageUpload = async (urls: string[]) => {
    if (urls.length === 0) return

    setUploading(true)
    try {
      await updateAvatar(urls[0])
      setImageUrl(urls[0])
      toast.success('Avatar updated successfully')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update avatar')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar Upload */}
      <div>
        <Label>Profile Picture</Label>
        <div className="mt-2 flex items-center gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={imageUrl || undefined} />
            <AvatarFallback>
              <UserIcon className="w-12 h-12" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <ImageUpload
              value={imageUrl ? [imageUrl] : []}
              onChange={handleImageUpload}
              maxImages={1}
              folder="avatars"
            />
            <p className="text-xs text-gray-500 mt-2">
              Recommended: Square image, at least 200x200px
            </p>
          </div>
        </div>
      </div>

      {/* Name Field */}
      <div>
        <Label htmlFor="name">
          Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
          placeholder="Enter your name"
          className="mt-1"
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field (Read-only) */}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          {...register('email')}
          type="email"
          disabled
          className="mt-1 bg-gray-50 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">
          Email cannot be changed. Contact support if needed.
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={isSubmitting || uploading}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
