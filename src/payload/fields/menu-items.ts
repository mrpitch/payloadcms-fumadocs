import type { Field, GroupField } from 'payload'

import deepMerge from '@/payload/utils/deepMerge'

export type LinkAppearances = 'default' | 'outline'

export const appearanceOptions: Record<LinkAppearances, { label: string; value: string }> = {
  default: {
    label: 'Default',
    value: 'default',
  },
  outline: {
    label: 'Outline',
    value: 'outline',
  },
}

type MenuLinkType = (options?: {
  appearances?: LinkAppearances[] | false
  disableLabel?: boolean
  overrides?: Partial<GroupField>
}) => Field

export const menuLink: MenuLinkType = ({
  appearances,
  disableLabel = false,
  overrides = {},
} = {}) => {
  const linkResult: GroupField = {
    name: 'link',
    label: '', //leave empty, so it's not shown
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              {
                label: 'Internal link',
                value: 'reference',
              },
              {
                label: 'Label',
                value: 'nolink',
              },
              {
                label: 'External link',
                value: 'external',
              },
            ],
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
      label: 'Document to link to',
      relationTo: ['docs'],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'external',
      },
      label: 'External URL',
      required: true,
    },
  ]

  if (!disableLabel) {
    linkTypes.map((linkType) => ({
      ...linkType,
      admin: {
        ...linkType.admin,
        width: '50%',
      },
    }))

    linkResult.fields.push(
      {
        type: 'row',
        fields: [
          {
            name: 'label',
            type: 'text',
            admin: {
              width: '50%',
            },
            label: 'Label',
            required: true,
          },
          ...linkTypes,
        ],
      },
      {
        type: 'group',
        admin: {
          hideGutter: true,
        },
        fields: [
          {
            name: 'menuChildLinks',
            type: 'array',
            label: 'Menu Child Links',
            admin: {
              components: {
                RowLabel: {
                  path: 'src/payload/components/menu-link-labels.ts',
                  exportName: 'MenuLinkChildLabel',
                },
              },
            },
            fields: [
              {
                type: 'row',
                fields: [
                  {
                    name: 'type',
                    type: 'radio',
                    admin: {
                      layout: 'horizontal',
                      width: '50%',
                    },
                    defaultValue: 'reference',
                    options: [
                      {
                        label: 'Internal link',
                        value: 'reference',
                      },
                      {
                        label: 'External link',
                        value: 'external',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'row',
                fields: [
                  {
                    name: 'label',
                    type: 'text',
                    label: 'Label',
                    required: true,
                  },
                  ...linkTypes,
                ],
              },
            ],
          },
        ],
      },
    )
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [appearanceOptions.default, appearanceOptions.outline]

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      admin: {
        description: 'Choose how the link should be rendered.',
      },
      defaultValue: 'default',
      options: appearanceOptionsToUse,
    })
  }

  return deepMerge(linkResult, overrides)
}
