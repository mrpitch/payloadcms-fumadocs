import { CollectionConfig, User } from 'payload'
import { Doc } from '@payload-types'

import { revalidateCache, revalidateCacheAfterDelete } from '@/payload/hooks/revalidate-cache'
import { autoSetPublishedAt } from '@/payload/hooks/auto-set-publishdate'
import { autoSetAuthor } from '@/payload/hooks/auto-set-author'

import { lexicalEditorConfig } from '@/payload/utils/lexical-editor'

export const Docs: CollectionConfig = {
  slug: 'docs',
  defaultPopulate: {
    slug: true,
    title: true,
  },
  admin: {
    group: 'Content',
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
              editor: lexicalEditorConfig,
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
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [autoSetAuthor<Doc, Doc['author'], User>()],
      },
    },
  ],
  hooks: {
    afterChange: [revalidateCache],
    afterDelete: [revalidateCacheAfterDelete],
  },
}
