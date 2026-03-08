import StaffPublicView from "../_components";

interface PageProps {
  params: Promise<{ staffId: string }>;
}

const StaffIdPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;

  if (!resolvedParams.staffId) return <div>Missing staff id</div>;

  return (
    <div className="border rounded-md">
      <h1>Staff Member: {resolvedParams.staffId}</h1>
      <StaffPublicView staffId={resolvedParams.staffId} />
    </div>
  );
};

export default StaffIdPage;
