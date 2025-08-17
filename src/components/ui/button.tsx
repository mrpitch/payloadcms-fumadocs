import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			color: {
				primary:
					'bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/80',
				outline: 'border hover:bg-fd-accent hover:text-fd-accent-foreground',
				ghost: 'hover:bg-fd-accent hover:text-fd-accent-foreground',
				secondary:
					'border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
			},
			size: {
				lg: 'gap-1 px4 py-1 text-lg',
				sm: 'gap-1 p-0.5 text-xs',
				icon: 'p-1.5 [&_svg]:size-5',
				'icon-sm': 'p-1.5 [&_svg]:size-4.5',
			},
		},
	}
)

export const linkVariants = cva(
	'no-underline hover:underline decoration-from-font',
	{
		variants: {
			color: {
				primary: 'text-fd-primary hover:text-fd-primary/80',
				secondary: 'text-fd-secondary hover:text-fd-secondary/80',
			},
			size: {
				lg: 'text-lg',
				sm: 'text-sm',
				xs: 'text-xs',
			},
		},
	}
)
