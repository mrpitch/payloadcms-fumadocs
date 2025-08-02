import { CollectionConfig, RichTextField } from 'payload'

import { revalidateCache, revalidateCacheAfterDelete } from '@/payload/hooks/revalidate-cache'

import {
  lexicalEditor,
  editorConfigFactory,
  HeadingFeature,
  ItalicFeature,
  BoldFeature,
  LinkFeature,
  UnorderedListFeature,
  OrderedListFeature,
  UnderlineFeature,
  BlockquoteFeature,
  ParagraphFeature,
} from '@payloadcms/richtext-lexical'

export const Docs: CollectionConfig = {
  slug: 'docs',
  defaultPopulate: {
    slug: true,
    title: true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'folder', 'slug', 'publishedAt', 'status'],
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
      label: 'Title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      localized: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Excerpt',
      localized: true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      label: 'Thumbnail',
      relationTo: 'media',
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'meta',
          label: 'SEO',
          fields: [],
        },
        {
          label: 'Content',
          description: 'Page Content',
          fields: [
            {
              name: 'copy',
              type: 'richText',
              localized: true,
              editor: lexicalEditor({
                features({ rootFeatures }) {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
                    ParagraphFeature(),
                    BoldFeature(),
                    UnderlineFeature(),
                    OrderedListFeature(),
                    UnorderedListFeature(),
                    LinkFeature(),
                    ItalicFeature(),
                    BlockquoteFeature(),
                  ]
                },
              }),
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
            if (siblingData?._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ req, value }) => {
            // If there's no author set and we have a user
            if (!value && req.user) {
              console.log('value', value)
              console.log('req', req.user)
              return req.user.id
            }
            return value
          },
        ],
      },
    },
  ],
  hooks: {
    afterChange: [revalidateCache],
    afterDelete: [revalidateCacheAfterDelete],
  },
}
