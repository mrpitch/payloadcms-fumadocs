import React from 'react'
import {
  DefaultNodeTypes,
  SerializedLinkNode,
  SerializedHeadingNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'

import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
  JSXConverters,
} from '@payloadcms/richtext-lexical/react'

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { relationTo, value } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug

  switch (relationTo) {
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

export const headingConverter: JSXConverters<SerializedHeadingNode> = {
  heading: ({ node, nodesToJSX }) => {
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

// Custom JSX converters that include the heading renderer
const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  ...headingConverter,
})

type Props = {
  data: DefaultTypedEditorState
} & React.HTMLAttributes<HTMLDivElement>

export const RichText = (props: Props) => {
  const { className, ...rest } = props
  return <ConvertRichText converters={jsxConverters} className={className} {...rest} />
}
