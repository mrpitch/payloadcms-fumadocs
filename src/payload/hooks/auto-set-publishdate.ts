import type { FieldHook, FieldHookArgs, TypeWithID } from 'payload'

// If your field is a Payload `date` field, prefer ISO string:
export const autoSetPublishedAt: FieldHook<TypeWithID, string | null> = ({
  siblingData,
  value,
}: FieldHookArgs<TypeWithID, string | null>) => {
  if (siblingData?._status === 'published' && (value == null || value === '')) {
    return new Date().toISOString()
  }
  return value ?? null
}
