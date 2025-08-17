import type { GlobalConfig } from 'payload'

import { menuLink } from '@/payload/fields/menu-items'

import { autoSetPublishedAt } from '@/payload/hooks/auto-set-publishdate'
import { revalidateCacheForGlobals } from '@/payload/hooks/revalidate-cache'

export const Settings: GlobalConfig = {
  slug: 'settings',
  admin: {
    group: 'Admin',
  },
  versions: {
    drafts: {
      autosave: {
        interval: 1000, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    max: 10,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'settings',
          label: 'Settings',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
            },
            {
              name: 'siteDescription',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'docsMenu',
          label: 'Docs Menu',
          fields: [
            {
              name: 'menuSections',
              type: 'array',
              label: 'Menu Sections',
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: {
                    path: 'src/payload/components/menu-labels.ts',
                    exportName: 'MenuSectionLabel',
                  },
                },
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'label',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                  required: false,
                },
                {
                  name: 'indexItem',
                  type: 'relationship',
                  label: 'Index Item',
                  relationTo: 'docs',
                  required: true,
                },
                {
                  name: 'menuItems',
                  type: 'array',
                  label: 'Menu Items',
                  admin: {
                    initCollapsed: true,
                    components: {
                      RowLabel: {
                        path: 'src/payload/components/menu-labels.ts',
                        exportName: 'MenuLinkLabel',
                      },
                    },
                  },
                  fields: [
                    menuLink({
                      appearances: false,
                    }),
                  ],
                  dbName: 'menuSections',
                  minRows: 1,
                  maxRows: 15,
                },
              ],
            },
          ],
        },
        {
          name: 'playground',
          label: 'Playground',
          fields: [
            {
              name: 'myTest',
              type: 'ui',
              admin: {
                components: {
                  Field: {
                    path: 'src/payload/components/test.tsx#Test',
                    exportName: 'Test',
                  },
                },
              },
            },
            {
              name: 'jsonTest',
              type: 'json',
            },
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },

      hooks: {
        beforeChange: [autoSetPublishedAt],
      },
    },
  ],
  hooks: {
    afterChange: [revalidateCacheForGlobals],
  },
}
