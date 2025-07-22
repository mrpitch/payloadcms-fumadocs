'use server'

import { revalidateTag } from 'next/cache'

import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export const revalidateCache: CollectionAfterChangeHook = async ({
	doc,
	previousDoc,
	collection,
}) => {
	// Skip revalidation during initialization
	if (process.env.PAYLOAD_SEED === 'true') {
		return doc
	}

	if (doc._status === 'published' && previousDoc?._status !== 'published') {
		revalidateTag(`${collection.slug}_${doc.slug}`)
		revalidateTag(`collection_${collection.slug}`)
	}
	return doc
}

export const revalidateCacheAfterDelete: CollectionAfterDeleteHook = async ({
	doc,
	collection,
}) => {
	// Skip revalidation during initialization
	if (process.env.PAYLOAD_SEED === 'true') {
		return
	}

	revalidateTag(`${collection.slug}_${doc.slug}`)
	revalidateTag(`collection_${collection.slug}`)
}
