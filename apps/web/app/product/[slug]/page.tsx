
const ProductItem = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await params
  return (
    <div>
        <div>My Post: {slug}</div>
    </div>
  )
}
export default ProductItem