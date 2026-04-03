import StaffPublicView from "../_components/staff-public-view";

interface PageProps {
  params: Promise<{ staffId: string }>;
}

const StaffIdPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;

  if (!resolvedParams.staffId) return <div>Missing staff id</div>;

  return (
    <div>
      <StaffPublicView staffId={resolvedParams.staffId} />
    </div>
  );
};

export default StaffIdPage;
