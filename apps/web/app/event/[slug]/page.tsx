
const EventPageItem = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await params
  return (
    <div>
        <div>My Event: {slug}</div>
    </div>
  )
}
export default EventPageItem