import type { Access } from 'payload'

import { checkRole } from '@/payload/hooks/check-role'
import type { User } from '@payload-types'

export const adminAndEditor: Access = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin', 'editor'], user as User)) {
      return true
    }

    return {
      id: {
        equals: user.id,
      },
    }
  }

  return false
}
