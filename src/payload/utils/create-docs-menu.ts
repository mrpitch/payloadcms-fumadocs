import type { PageTree } from 'fumadocs-core/server'
import type { Setting, Doc } from '@payload-types'

/**
 * The Payload global `settings` contains a `docsMenu` field
 * that we use to build navigation for Fumadocs.
 */
export type DocsMenu = NonNullable<Setting['docsMenu']>

/**
 * Our own helper structure representing a sidebar "tab".
 * Fumadocs does not export a Tab type — in Fumadocs,
 * "tabs" are just `PageTree.Folder` nodes with `root: true`.
 *
 * We keep this type for convenience if we want to render
 * a custom tab navigation UI elsewhere in our app.
 */
export interface SidebarTab {
  title: string
  description?: string | null
  url: string // Primary landing URL for the tab
  urls: Set<string> // All URLs under this tab
}

/**
 * Options to control how we map the Payload docsMenu to Fumadocs types.
 */
export interface MapOptions {
  /** Base path prefix for all docs routes (default: "/docs"). */
  basePath?: string
  /** Label of the root tree (default: "Documentation"). */
  treeName?: string
  /** Whether to include the index page in the folder's children list (default: true). */
  includeIndexInChildren?: boolean
}

/** Default values for the mapping options. */
const defaults: Required<MapOptions> = {
  basePath: '/docs',
  treeName: 'Documentation',
  includeIndexInChildren: true,
}

/**
 * Type guard: check if a value is a fully populated `Doc` object
 * instead of just an ID (number).
 */
const isDoc = (v: unknown): v is Doc =>
  !!v && typeof v === 'object' && 'slug' in (v as any) && 'title' in (v as any)

/**
 * Safely coerce a `number | Doc | null` into a `Doc | undefined`.
 * Payload relations can return either an ID (number) or the full object,
 * depending on query depth. With `depth: 5` in `getDocsMenu`, we
 * should always get a full `Doc` object.
 */
const toDoc = (maybe: number | Doc | undefined | null): Doc | undefined =>
  isDoc(maybe) ? maybe : undefined

/** Build a canonical URL for a Doc (adds basePath prefix). */
const docUrl = (d: Doc, basePath: string) => `${basePath}/${d.slug}`

/** Build a Fumadocs PageTree page node */
const page = (name: string, url: string): PageTree.Item => ({
  type: 'page',
  name,
  url,
})

/** Build an external page node (with `external: true`) */
const externalPage = (name: string, url: string): PageTree.Item => ({
  type: 'page',
  name,
  url,
  external: true,
})

/**
 * Map the Payload `docsMenu` into a Fumadocs `PageTree.Root`.
 *
 * Each `menuSection` becomes a root-level folder (with `root: true`),
 * which Fumadocs will render as a "Sidebar Tab".
 *
 * - `reference` links map to page nodes.
 * - `nolink` items map to folders with their `menuChildLinks`.
 * - `external` links map to pages with an absolute URL.
 * - `indexItem` is set as the folder's `.index` (landing page).
 */
export function mapPageTreeFromDocsMenu(
  docsMenu: DocsMenu | undefined,
  options?: MapOptions,
): PageTree.Root {
  const { basePath, treeName, includeIndexInChildren } = { ...defaults, ...options }

  const sections = docsMenu?.menuSections ?? []

  const children: PageTree.Node[] = sections.map((section): PageTree.Folder => {
    const indexDoc = toDoc(section.indexItem)
    const folderChildren: PageTree.Node[] = []

    for (const item of section.menuItems ?? []) {
      const link = item.link
      switch (link?.type) {
        case 'reference': {
          const d = toDoc(link.reference?.value as any)
          if (d) folderChildren.push(page(d.title, docUrl(d, basePath)))
          break
        }
        case 'nolink': {
          const subChildren: PageTree.Node[] = []
          for (const child of link.menuChildLinks ?? []) {
            if (child.type === 'reference') {
              const d = toDoc(child.reference?.value as any)
              if (d) subChildren.push(page(d.title, docUrl(d, basePath)))
            } else if (child.type === 'external' && child.url) {
              subChildren.push(externalPage(child.label, child.url))
            }
          }
          folderChildren.push({
            type: 'folder',
            name: link.label,
            children: subChildren,
          })
          break
        }
        case 'external': {
          if (link.url) folderChildren.push(externalPage(link.label, link.url))
          break
        }
        default:
          break
      }
    }

    const folder: PageTree.Folder = {
      type: 'folder',
      root: true, // root folders are shown as tabs in Fumadocs sidebar
      name: section.label,
      children: folderChildren,
    }

    // Add the index page if one exists
    if (indexDoc) {
      const idx = page(indexDoc.title, docUrl(indexDoc, basePath))
      folder.index = idx

      if (includeIndexInChildren) {
        const dup = folderChildren.some((n) => n.type === 'page' && n.url === idx.url)
        if (!dup) folder.children = [idx, ...folderChildren]
      }
    }

    return folder
  })

  return {
    name: treeName,
    children,
  }
}

/**
 * Build a list of SidebarTabs (our own helper type).
 *
 * This function collects all URLs within each section,
 * and determines a "primary" URL (index page or first page)
 * to use as the tab's landing link.
 */
export function mapTabsFromDocsMenu(
  docsMenu: DocsMenu | undefined,
  options?: Pick<MapOptions, 'basePath'>,
): SidebarTab[] {
  const { basePath } = { ...defaults, ...options }
  const sections = docsMenu?.menuSections ?? []

  return sections.map((section): SidebarTab => {
    const urls = new Set<string>()
    const addDoc = (d?: Doc) => d && urls.add(docUrl(d, basePath))

    // Always include the section index (if any)
    const indexDoc = toDoc(section.indexItem)
    addDoc(indexDoc)

    // Walk menu items and collect URLs
    for (const item of section.menuItems ?? []) {
      const link = item.link
      if (link?.type === 'reference') {
        addDoc(toDoc(link.reference?.value as any))
      } else if (link?.type === 'nolink') {
        for (const child of link.menuChildLinks ?? []) {
          if (child.type === 'reference') addDoc(toDoc(child.reference?.value as any))
          else if (child.type === 'external' && child.url) urls.add(child.url)
        }
      } else if (link?.type === 'external' && link.url) {
        urls.add(link.url)
      }
    }

    // Pick primary URL: indexDoc if available, else the first collected
    const url = indexDoc ? docUrl(indexDoc, basePath) : (Array.from(urls)[0] ?? '/')

    return {
      title: section.label,
      description: section.description ?? null,
      url,
      urls,
    }
  })
}
