'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { verifyUser, suspendUser, unsuspendUser, changeUserRole } from '@/app/actions/admin'
import { toast } from 'sonner'

interface User {
  id: string
  name: string | null
  email: string
  role: string
  verified: boolean
  suspended: boolean
}

export function UsersActions({ user }: { user: User }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showRoleDialog, setShowRoleDialog] = useState(false)

  const handleVerify = async () => {
    if (user.verified) return
    
    setLoading(true)
    try {
      await verifyUser(user.id)
      toast.success('User verified successfully')
      router.refresh()
    } catch {
      toast.error('Failed to verify user')
    } finally {
      setLoading(false)
    }
  }

  const handleSuspend = async () => {
    setLoading(true)
    try {
      if (user.suspended) {
        await unsuspendUser(user.id)
        toast.success('User unsuspended successfully')
      } else {
        await suspendUser(user.id)
        toast.success('User suspended successfully')
      }
      router.refresh()
    } catch {
      toast.error('Failed to update user status')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async () => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
    setLoading(true)
    try {
      await changeUserRole(user.id, newRole)
      toast.success(`Role changed to ${newRole}`)
      setShowRoleDialog(false)
      router.refresh()
    } catch {
      toast.error('Failed to change user role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex justify-end gap-2">
        {!user.verified && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleVerify}
            disabled={loading}
          >
            Verify
          </Button>
        )}
        
        <Button
          size="sm"
          variant={user.suspended ? 'default' : 'destructive'}
          onClick={handleSuspend}
          disabled={loading}
        >
          {user.suspended ? 'Unsuspend' : 'Suspend'}
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowRoleDialog(true)}
          disabled={loading}
        >
          Change Role
        </Button>
      </div>

      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Change role for {user.name} ({user.email})
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Current role: <strong>{user.role}</strong></p>
            <p className="mt-2">New role: <strong>{user.role === 'ADMIN' ? 'USER' : 'ADMIN'}</strong></p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleChange} disabled={loading}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
