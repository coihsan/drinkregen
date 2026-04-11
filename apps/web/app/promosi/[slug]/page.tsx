
const PromosiItemPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await params
  return (
    <div>
        <div>My Promosi: {slug}</div>
    </div>
  )
}
export default PromosiItemPage