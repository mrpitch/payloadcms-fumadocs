import type { GlobalConfig } from 'payload'
import { link } from '@/payload/fields/links'

export const AppConfiguration: GlobalConfig = {
  slug: 'app-configuration',
  admin: {},
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
          name: 'mainNavigation',
          label: 'Main Navigation',
          fields: [
            {
              name: 'navItems',
              type: 'array',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'href',
                  type: 'text',
                  required: true,
                },
              ],
              minRows: 1,
              maxRows: 15,
            },
          ],
        },
        {
          name: 'legalNavigation',
          label: 'Legal Navigation',
          fields: [
            {
              name: 'navItems',
              type: 'array',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'href',
                  type: 'text',
                  required: true,
                },
              ],
              minRows: 1,
              maxRows: 5,
            },
          ],
        },
        {
          name: 'sideBarNavigation',
          label: 'Sidebar Navigation',
          fields: [
            {
              name: 'navItems',
              type: 'array',
              label: 'Sidebar Navigation Items',
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: {
                    path: 'src/payload/components/nav-link-labels.ts',
                    exportName: 'NavLinkLabel',
                  },
                },
              },
              fields: [
                link({
                  appearances: false,
                }),
              ],

              minRows: 1,
              maxRows: 15,
              dbName: 'sidebarNavigationNavItems',
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
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
  ],
}
