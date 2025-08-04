import type { CollectionConfig } from 'payload'

import { menuLink } from '../fields/menu-items'

const Menu: CollectionConfig = {
  slug: 'menu',
  defaultPopulate: {
    slug: true,
    title: true,
  },
  admin: {
    group: 'Content',
  },
  versions: {
    drafts: {
      autosave: {
        interval: 1000, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 10,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
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
            path: 'src/payload/components/menu-link-labels.ts',
            exportName: 'MenuLinkLabel',
          },
        },
      },
      fields: [
        menuLink({
          appearances: false,
        }),
      ],

      minRows: 1,
      maxRows: 15,
      dbName: 'menuItems',
    },
  ],
}

export { Menu }
