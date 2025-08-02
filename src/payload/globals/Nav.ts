import { GlobalConfig } from 'payload'
import { link } from '../fields/links'

const Nav: GlobalConfig = {
  admin: {
    group: 'Admin',
  },

  slug: 'nav',
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
}

export { Nav }
