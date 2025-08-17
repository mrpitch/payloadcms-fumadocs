'use client'

//import Image from 'next-export-optimize-images/image'
import Picture from 'next-export-optimize-images/picture'
import { getOptimizedImageProps } from 'next-export-optimize-images/image'
import { type ImageProps } from 'next/image'
import { type ImgHTMLAttributes } from 'react'
import './image-zoom.css'
import Zoom, { type UncontrolledProps } from 'react-medium-image-zoom'

export type ImageZoomProps = ImageProps & {
	/**
	 * Image props when zoom in
	 */
	zoomInProps?: ImgHTMLAttributes<HTMLImageElement>

	/**
	 * Props for `react-medium-image-zoom`
	 */
	rmiz?: UncontrolledProps
	alt?: string
}

export function ImageZoom({
	zoomInProps,
	children,
	rmiz,
	alt = '',
	...props
}: ImageZoomProps) {
	const optimizedImageProps = getOptimizedImageProps({
		src: props.src,
		alt: '',
		width: props.width,
		height: props.height,
	}).props
	return (
		<Zoom
			zoomMargin={20}
			wrapElement="span"
			{...rmiz}
			zoomImg={{
				src: optimizedImageProps.src,
				sizes: undefined,
				...zoomInProps,
			}}
		>
			{children ?? (
				<Picture
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
					alt={alt}
					{...props}
				/>
			)}
		</Zoom>
	)
}
