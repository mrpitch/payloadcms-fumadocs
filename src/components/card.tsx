import Link from 'fumadocs-core/link'
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

export function Cards(props: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div {...props} className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2', props.className)}>
      {props.children}
    </div>
  )
}

export type CardProps = HTMLAttributes<HTMLElement> & {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  type?: 'default' | 'primary'

  href?: string
  external?: boolean
}

export function Card({
  icon,
  title,
  description,
  type = 'default',
  ...props
}: CardProps): React.ReactElement {
  const E = props.href ? Link : 'div'

  return (
    <E
      {...props}
      data-card
      className={cn(
        'block rounded-lg border p-4 shadow-md transition-colors',
        type === 'default' && 'bg-fd-card text-fd-card-foreground border-fd-accent/80',
        type === 'default' && props.href && 'hover:bg-fd-accent/80',
        type === 'primary' && 'bg-fd-card text-fd-primary border-fd-primary/30',
        type === 'primary' && props.href && 'hover:bg-fd-primary/10',
        props.className,
      )}
    >
      {icon ? (
        <div className="not-prose mb-2 w-fit rounded-md border bg-fd-muted p-1.5 text-fd-muted-foreground [&_svg]:size-4">
          {icon}
        </div>
      ) : null}
      <h3 className="not-prose mb-1 text-sm font-medium">{title}</h3>
      {description ? (
        <p className="my-0 text-sm text-fd-muted-foreground truncate">{description}</p>
      ) : null}
      {props.children ? (
        <div className="text-sm text-fd-muted-foreground prose-no-margin">{props.children}</div>
      ) : null}
    </E>
  )
}
