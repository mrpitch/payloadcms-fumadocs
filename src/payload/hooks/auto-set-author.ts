import type { FieldHook, FieldHookArgs, TypeWithID } from 'payload'

// base constraint Payload expects for docs in hooks
type WithID = { id: string | number }

// Payload adds extra props (e.g. `collection`) to the auth user
type AuthUser<U extends WithID = WithID> = U & { collection?: string }

export function autoSetAuthor<
  Doc extends TypeWithID,
  Value,
  U extends WithID = WithID,
>(): FieldHook<Doc, Value> {
  return ({ req, value }: FieldHookArgs<Doc, Value>) => {
    // Widen & null-safe: Payload's req.user is (AuthUser | null)
    const authUser = req.user as unknown as AuthUser<U> | null

    if (value == null && authUser?.id != null) {
      return authUser.id as unknown as Value
    }
    return value as Value
  }
}
