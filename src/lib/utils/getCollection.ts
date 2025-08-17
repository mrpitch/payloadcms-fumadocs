/**
 * Utility functions for fetching and querying PayloadCMS collections with type safety and caching.
 *
 * This module provides generic, type-safe helpers for retrieving documents, slugs, and lists from
 * PayloadCMS collections (e.g., docs, pages, posts). All functions leverage Next.js caching for
 * performance and ensure correct TypeScript types based on the collection being queried.
 *
 * Example usage:
 *
 * import { getCollectionBySlug } from '@/lib/utils/getCollections'
 *
 * const doc = await getCollectionBySlug({ collection: 'docs', slug: 'my-doc' })
 * // doc is typed as Doc | null
 *
 * Notes:
 * - All functions return null or empty arrays if no results are found.
 * - Functions are type-safe and will error at compile time if used with invalid collection names.
 * - Caching is handled via Next.js unstable_cache for performance.
 *
 * To add a new collection:
 * 1. Update TCollection and TCollectionTypeMap with the new collection and its type.
 * 2. Ensure the new type is imported from @payload-types.
 * 3. Functions will automatically support the new collection.
 */
import { unstable_cache } from 'next/cache'

import { getPayload } from 'payload'

import configPromise from '@payload-config'
import type { Doc, Menu } from '@payload-types'
import { importMap } from '@/app/(payload)/admin/importMap'

import { revalidate } from '@/lib/utils/constants'

export type TCollection = 'docs'

export interface TCollectionTypeMap {
  docs: Doc
}

const payload = await getPayload({
  config: configPromise,
  cron: false,
  importMap,
})

/**
 * Fetches all slugs for a given collection.
 *
 * @param collection - The collection name (e.g., 'docs', 'pages', 'posts').
 * @param draft - Whether to include draft documents (default: true).
 * @param limit - Maximum number of results to fetch (default: 1000).
 * @returns The result of the Payload find query, containing only the slug field for each document.
 */
export const getSlugs = async (collection: TCollection, draft?: boolean, limit?: number) => {
  const cached = unstable_cache(
    async () => {
      return await payload.find({
        collection: collection,
        draft: true,
        limit: limit || 1000,
        overrideAccess: true,
        pagination: false,
        select: {
          slug: true,
        },
      })
    },
    [`slugs_${collection}`],
    { revalidate: revalidate, tags: ['slugs', `slugs_${collection}`] },
  )
  return cached()
}

/**
 * Fetches a single document from a collection by its slug, with type safety based on the collection.
 *
 * @template T - The collection name, constrained to TCollection.
 * @param params.collection - The collection name (e.g., 'docs', 'pages', 'posts').
 * @param params.slug - The slug of the document to fetch.
 * @param params.draft - Whether to include draft documents (default: false).
 * @param params.limit - (Unused) Optional limit parameter for future extensibility.
 * @returns The document of the correct type for the collection, or null if not found.
 */
export const getCollectionBySlug = async <T extends TCollection>({
  collection,
  slug,
  draft,
}: {
  collection: T
  slug: string
  draft?: boolean
}): Promise<TCollectionTypeMap[T] | null> => {
  console.log('slug', slug)
  const cached = unstable_cache(
    async () => {
      const result = await payload.find({
        collection: collection,
        depth: 3,
        draft: draft || false,
        overrideAccess: true,
        limit: 1,
        pagination: false,
        where: {
          slug: {
            equals: slug,
          },
        },
      })

      return result.docs?.[0] || null
    },
    [`${collection}_${slug}`],
    { revalidate: revalidate, tags: [`collection_${collection}`, `${collection}_${slug}`] },
  )

  return cached()
}

/**
 * Fetches all documents from a collection, with type safety based on the collection.
 *
 * @template T - The collection name, constrained to TCollection.
 * @param collection - The collection name (e.g., 'docs', 'pages', 'posts').
 * @param draft - Whether to include draft documents (default: false).
 * @param limit - Maximum number of results to fetch (default: 100).
 * @returns An object containing an array of documents of the correct type and the total document count.
 */
export const getAllByCollection = async <T extends TCollection>(
  collection: T,
  draft?: boolean,
  limit?: number,
): Promise<{ docs: TCollectionTypeMap[T][]; totalDocs: number }> => {
  const cached = unstable_cache(
    async () => {
      const result = await payload.find({
        collection,
        depth: 3,
        draft: draft || false,
        overrideAccess: true,
        limit: limit ?? 100,
        pagination: true,
        sort: 'title',
        select: {
          slug: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          publishedAt: true,
          categories: true,
          relatedPosts: true,
          excerpt: true,
        },
      })
      return {
        docs: (result.docs || []) as TCollectionTypeMap[T][],
        totalDocs: result.totalDocs,
      }
    },
    [`all_${collection}`],
    { revalidate: revalidate, tags: [`collection_${collection}`] },
  )

  return cached()
}

export const getMenuBySlug = async (slug: string): Promise<Menu | null> => {
  const cached = unstable_cache(
    async () => {
      const result = await payload.find({
        collection: 'menu',
        depth: 3,
        draft: false,
        overrideAccess: true,
        limit: 1,
        pagination: false,
        where: {
          slug: {
            equals: slug,
          },
        },
      })

      return result.docs?.[0] || null
    },
    [`menu_${slug}`],
    { revalidate: revalidate, tags: [`menu`, `menu_${slug}`] },
  )

  return cached()
}
