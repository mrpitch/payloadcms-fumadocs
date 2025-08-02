import type { Nav, Doc } from '@payload-types'
import type { PageTree } from 'fumadocs-core/server'

function isDoc(value: number | Doc): value is Doc {
  return typeof value === 'object' && value !== null && 'slug' in value
}

export function createPageTree(nav: Nav): PageTree.Root {
  const transformNestedLink = (
    link: NonNullable<NonNullable<Nav['navItems']>[number]['link']['nestedLinks']>[number],
  ) => {
    const type = link.type
    const isExternal = type === 'external'
    let url = ''

    if (type === 'reference' && link.reference && isDoc(link.reference.value)) {
      url = `/docs/${link.reference.value.slug}`
    } else if (type === 'external' && link.url) {
      url = link.url
    }

    return {
      type: 'page' as const,
      name: link.label,
      url,
      external: isExternal,
    }
  }

  const children =
    nav.navItems
      ?.map((navItem) => {
        const link = navItem.link
        const { type, label, reference, url, nestedLinks } = link

        if (type === 'reference' && reference && isDoc(reference.value) && nestedLinks?.length) {
          return {
            type: 'folder' as const,
            name: label,
            index: {
              type: 'page' as const,
              name: reference.value.title || 'Index',
              url: `/docs/${reference.value.slug}`,
            },
            children: nestedLinks.map(transformNestedLink),
          }
        }

        if (type === 'nolink' && nestedLinks?.length) {
          return {
            type: 'folder' as const,
            name: label,
            children: nestedLinks.map(transformNestedLink),
          }
        }

        if (type === 'reference' && reference && isDoc(reference.value)) {
          return {
            type: 'page' as const,
            name: label,
            url: `/docs/${reference.value.slug}`,
            external: false,
          }
        }

        if (type === 'external' && url) {
          return {
            type: 'page' as const,
            name: label,
            url,
            external: true,
          }
        }

        return null
      })
      .filter((child) => child !== null) ?? []

  return {
    name: 'Sidebar Nav Docs',
    children,
  }
}
