export type MenuItem = {
  type: 'reference' | 'folder'
  label?: string
  reference?: {
    relationTo: string
    value: string
  }
  menuChildLinks?: any[]
}
