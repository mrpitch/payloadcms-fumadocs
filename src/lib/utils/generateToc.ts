import type { TOCItemType } from 'fumadocs-core/server'

// Type definitions for Lexical document structure
type LexicalTextNode = {
  type: 'text'
  text: string
  [key: string]: unknown
}

type LexicalHeadingNode = {
  type: 'heading'
  tag: string
  children: LexicalTextNode[]
  [key: string]: unknown
}

type LexicalDocument = {
  root: {
    children: (LexicalHeadingNode | { type: string; [key: string]: unknown })[]
    [key: string]: unknown
  }
}

export function generateTocFromLexical(doc: LexicalDocument): TOCItemType[] {
  return doc.root.children
    .filter((node): node is LexicalHeadingNode => node.type === 'heading')
    .map((heading) => {
      const depth = parseInt(heading.tag.replace('h', ''), 10)
      const textNode = heading.children.find((child) => child.type === 'text')
      const title = textNode?.text ?? 'Untitled'

      return {
        title,
        depth,
        url: `#${title.toLowerCase().replace(/\s+/g, '-')}`,
      }
    })
}

// Alternative function that works with the actual PayloadCMS structure
export function generateTocFromPayload(doc: LexicalDocument): TOCItemType[] {
  if (!doc?.root?.children) {
    return []
  }

  return doc.root.children
    .filter((node): node is any => node.type === 'heading')
    .map((heading) => {
      const depth = parseInt(heading.tag.replace('h', ''), 10)
      const textNode = heading.children?.find((child: any) => child.type === 'text')
      const title = textNode?.text ?? 'Untitled'

      return {
        title,
        depth,
        url: `#${title.toLowerCase().replace(/\s+/g, '-')}`,
      }
    })
}
