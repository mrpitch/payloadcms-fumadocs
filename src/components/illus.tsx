import { ImageZoom } from '@/components/image-zoom'

interface IIllu {
	slug: string
	name: string
	image: string
}

// interface ISlides {
// 	slides: ISlide[]
// }
const getIllusData = async () => {
	try {
		// Using dynamic import for JSON
		const illusData = await import('@/data/illus.json')
		return illusData.illus as IIllu[]
	} catch (error) {
		console.error('Error loading illus:', error)
		return [] as IIllu[]
	}
}

const getIllusBySlug = async (slug: string) => {
	const illus = await getIllusData()
	return illus.find((illus) => illus.slug === slug)
}

export const Illus = async () => {
	const illus = await getIllusData()

	return (
		<div>
			{illus.map((illus) => (
				<div key={illus.name}>{illus.name}</div>
			))}
		</div>
	)
}

export const Illu = async ({ slug }: { slug: string }) => {
	const illus = await getIllusBySlug(slug)
	if (!illus) return null

	return (
		<div className="mb-8">
			<ImageZoom
				src={illus?.image}
				width={640}
				height={480}
				alt={illus?.name}
			/>
		</div>
	)
}
