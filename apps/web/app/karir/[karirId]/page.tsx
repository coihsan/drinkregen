 const KarirPageId = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
 
  return (
    <div>
      <main>
        <h1>Karir ID : {id}</h1>
      </main>
    </div>
  )
}
export default KarirPageId