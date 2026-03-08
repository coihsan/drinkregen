import prisma from "@/lib/prisma";

interface StaffPublicViewProps {
    staffId: string;
}

const StaffPublicView = async ({ staffId }: StaffPublicViewProps) => {
    const data = await prisma.user.findFirst({
        where: { id: staffId },
        include: { division: true }
    });

    if (!data) return <div>Staff not found</div>;

    return (
        <div>
            <h2>Staff Directory</h2>
            <p>Name: {data.name}</p>
            <p>Staff ID: {data.staffId}</p>
            <p>{data.position || "Not provided"}</p>
            <p>{data.division?.name || "No Division"}</p>
            <p>Email: {data.email}</p>
            <p>Phone: {data.phoneNumber || "Not provided"}</p>
            <p>{data.coverArea || "No cover area specified"}</p>
        </div>
    );
};

export default StaffPublicView;