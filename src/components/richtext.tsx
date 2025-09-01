import React from 'react'

import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

const internalDocToHref = ({ linkNode }: { linkNode: any }) => {
  const { relationTo, value } = linkNode.fields?.doc || {}
  if (typeof value !== 'object' || !value?.slug) {
    return '#'
  }
  const slug = value.slug

  switch (relationTo) {
    case 'docs':
      return `/docs/${slug}`
    case 'posts':
      return `/posts/${slug}`
    case 'categories':
      return `/category/${slug}`
    case 'pages':
      return `/${slug}`
    default:
      return `/${relationTo}/${slug}`
  }
}

const headingConverter = {
  heading: ({ node, nodesToJSX }: any) => {
    const tag = node.tag || 'h2'
    const text = nodesToJSX({ nodes: node.children })

    const id = text
      .join('')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    const headingClassName = 'flex scroll-m-28 flex-row items-center gap-2'

    switch (tag) {
      case 'h2':
        return (
          <h2 id={id} className={headingClassName}>
            <a data-card href={`#${id}`} className="peer">
              {text}
            </a>
          </h2>
        )
      case 'h3':
        return (
          <h3 id={id} className={headingClassName}>
            <a data-card href={`#${id}`} className="peer">
              {text}
            </a>
          </h3>
        )
      case 'h4':
        return (
          <h4 id={id} className={headingClassName}>
            <a data-card href={`#${id}`} className="peer">
              {text}
            </a>
          </h4>
        )
      case 'h5':
        return (
          <h5 id={id} className={headingClassName}>
            <a data-card href={`#${id}`} className="peer">
              {text}
            </a>
          </h5>
        )
      case 'h6':
        return (
          <h6 id={id} className={headingClassName}>
            <a data-card href={`#${id}`} className="peer">
              {text}
            </a>
          </h6>
        )
      default:
        return (
          <h2 id={id} className={headingClassName}>
            <a data-card href={`#${id}`} className="peer">
              {text}
            </a>
          </h2>
        )
    }
  },
}

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }: any) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  ...headingConverter,
})

type Props = {
  data: any // Changed from DefaultTypedEditorState
} & React.HTMLAttributes<HTMLDivElement>

export const RichText = (props: Props) => {
  const { className, ...rest } = props
  return <ConvertRichText converters={jsxConverters} className={className} {...rest} />
}
