import { GlobalConfig } from 'payload'

const Nav: GlobalConfig = {
  admin: {
    group: 'Admin',
  },
  fields: [
    {
      name: 'navLink',
      interfaceName: 'NavLinksProps',
      label: 'Navigation Links',
      admin: {
        components: {
          RowLabel: {
            path: 'src/payload/components/nav-link-labels.ts',
            exportName: 'NavLinkLabel',
          },
        },
      },
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'linkType',
          type: 'radio',
          options: ['External', 'Internal', 'No Link'],
          defaultValue: 'Internal',
        },
        {
          name: 'openInNewTab',
          type: 'radio',
          options: ['Yes', 'No'],
          admin: {
            description: 'Should this open in a new browser window/tab?',
          },
        },
        {
          name: 'externalLink',
          type: 'text',
          admin: {
            condition: (data, siblingData) => {
              if (siblingData.linkType === 'External') {
                return true
              } else {
                return false
              }
            },
          },
        },
        {
          name: 'link',
          type: 'relationship',
          relationTo: ['docs'],
          admin: {
            condition: (data, siblingData) => {
              if (siblingData.linkType === 'Internal') {
                return true
              } else {
                return false
              }
            },
          },
        },
        {
          name: 'nestedLinks',
          type: 'array',
          maxRows: 1,
          admin: {
            components: {
              RowLabel: {
                path: 'src/payload/components/nav-link-labels.ts',
                exportName: 'NavLinkLabel',
              },
            },
          },
          fields: [
            {
              name: 'navigationLink',
              admin: {
                components: {
                  RowLabel: {
                    path: 'src/payload/components/nav-link-labels.ts',
                    exportName: 'NavLinkLabel',
                  },
                },
              },
              type: 'array',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                },
                {
                  name: 'linkType',
                  type: 'radio',
                  options: ['External', 'Internal'],
                  defaultValue: 'Internal',
                },
                {
                  name: 'openInNewTab',
                  type: 'radio',
                  options: ['Yes', 'No'],
                  admin: {
                    description: 'Should this open in a new browser window/tab?',
                  },
                },
                {
                  name: 'externalLink',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => {
                      if (siblingData.linkType === 'External') {
                        return true
                      } else {
                        return false
                      }
                    },
                  },
                },
                {
                  name: 'link',
                  type: 'relationship',
                  relationTo: ['docs'],
                  admin: {
                    condition: (data, siblingData) => {
                      if (siblingData.linkType === 'Internal') {
                        return true
                      } else {
                        return false
                      }
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  slug: 'nav',
}

export { Nav }
