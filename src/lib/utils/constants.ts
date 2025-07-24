export const revalidate = !process.env.NEXT_PUBLIC_REVALIDATE
  ? 0
  : parseInt(process.env.NEXT_PUBLIC_REVALIDATE)
