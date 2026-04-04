import { Metadata } from "next";
import db from "@/lib/db";

export async function generateMetadata({id}: {id: string}): Promise<Metadata> {
  const data = await db.staff.findFirst({
    where: {id: id}
  })
  if (!data) {
    return {
      title: "Staff Not Found",
      description: "The staff member you are looking for does not exist.",
      robots: { index: false, follow: false },
    };
  }
  
  return {
    title: `${data.name} — Regen Staff`,
    description: `Information about ${data.name}, a staff member at Regen.`,
    robots: { index: false, follow: false },
  };
}

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full justify-center mx-auto">
        <div className="p-4">
            {children}
        </div>
    </div>
  );
}
export default PublicLayout;