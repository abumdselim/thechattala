import { getProfile } from '@/app/actions/user'
import { Card } from '@/components/ui/card'
import { ProfileForm } from './profile-form'

export default async function ProfilePage() {
  const profile = await getProfile()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account information and preferences
        </p>
      </div>

      <Card className="p-6">
        <ProfileForm profile={profile} />
      </Card>

      {/* Account Info */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Account Information
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-600">Account Status</span>
            <span className={`font-medium ${profile.suspended ? 'text-red-600' : 'text-green-600'}`}>
              {profile.suspended ? 'Suspended' : 'Active'}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-600">Verification Status</span>
            <span className={`font-medium ${profile.verified ? 'text-green-600' : 'text-yellow-600'}`}>
              {profile.verified ? 'Verified' : 'Not Verified'}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-600">Role</span>
            <span className="font-medium capitalize">{profile.role.toLowerCase()}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-600">Member Since</span>
            <span className="font-medium">
              {new Date(profile.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Your Activity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {profile._count.products}
            </p>
            <p className="text-sm text-gray-600 mt-1">Products</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {profile._count.posts}
            </p>
            <p className="text-sm text-gray-600 mt-1">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {profile._count.comments}
            </p>
            <p className="text-sm text-gray-600 mt-1">Comments</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
