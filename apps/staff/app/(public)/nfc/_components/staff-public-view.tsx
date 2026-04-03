import db from "@/lib/db";
import Image from "next/image";
import {CheckCheck, Mail, User} from "lucide-react"

interface StaffPublicViewProps {
    staffId: string;
}

const StaffPublicView = async ({ staffId }: StaffPublicViewProps) => {
    const data = await db.staff.findFirst({
        where: { id: staffId },
        include: { division: true }
    });

    if (!data) return <div>Staff not found</div>;

    const activeStatus = data.activeStatus ? "Active" : "Inactive";

    return (
        <div>
            <h2>Staff Directory</h2>
            <div className="flex items-center">
                <CheckCheck className="inline-block mr-1 size-5" />
                <span>{activeStatus}</span>
            </div>
            <h3>{data.name}</h3>
            <p>Staff ID: {data.staffId}</p>
            <div>
                <User className="inline-block mr-1 size-5" />
                <p>{data.position || "Not provided"}</p>
            </div>
            <p>{data.division?.name || "No Division"}</p>
            <div className="flex items-center">
                <Mail className="inline-block mr-1 size-5" />
                <p>Email: {data.email}</p>
            </div>
            <p>Phone: {data.phoneNumber || "Not provided"}</p>
            <p>{data.coverArea || "No cover area specified"}</p>
        </div>
    );
};

export default StaffPublicView;