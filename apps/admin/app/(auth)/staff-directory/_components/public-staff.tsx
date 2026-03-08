import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Globe,
  ArrowLeft,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { StaffTypes } from "@/types/staff";
import Link from "next/link";

export default function PublicProfile() {
  const { staffId } = useParams();
  const [staff, setStaff] = useState<StaffTypes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedStaff = localStorage.getItem("staff_list");
    if (savedStaff) {
      const list: StaffTypes[] = JSON.parse(savedStaff);
      const found = list.find((s) => s.id === staffId);
      if (found && found.isPublished) {
        setStaff(found);
      }
    }
    setLoading(false);
  }, [staffId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-20 h-20 bg-zinc-200 rounded-3xl mb-4"></div>
          <div className="h-4 w-32 bg-zinc-200 rounded mb-2"></div>
          <div className="h-3 w-24 bg-zinc-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <Globe className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">
          Profile Not Found
        </h1>
        <p className="text-zinc-500 max-w-md mb-8">
          The profile you are looking for does not exist or is set to private.
        </p>
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Hero Section */}
      <div className="h-64 bg-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,#10b981,transparent)]"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 h-full flex items-end pb-12">
          <Link
            href="/"
            className="absolute top-8 left-8 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto px-4 -mt-16">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-zinc-200/50 overflow-hidden border border-zinc-100">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[2rem] p-1.5 shadow-2xl">
                  <div className="w-full h-full bg-emerald-100 rounded-[1.5rem] flex items-center justify-center text-emerald-700 font-bold text-5xl">
                    {staff.name.charAt(0)}
                  </div>
                </div>
                {staff.activeStatus && (
                  <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-2xl shadow-lg">
                    <div className="bg-emerald-500 text-white p-2 rounded-xl">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 pt-4">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-4xl font-black text-zinc-900 tracking-tight">
                    {staff.name}
                  </h1>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 rounded-full text-zinc-600 text-xs font-bold uppercase tracking-wider">
                    <UserCheck className="w-3.5 h-3.5" />
                    Verified Staff
                  </div>
                </div>
                <p className="text-xl text-zinc-500 font-medium mb-6">
                  {staff.position} at {staff.division?.name || "N/A"}
                </p>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100 text-zinc-600 font-medium">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    {staff.coverArea}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100 text-zinc-600 font-medium">
                    <Briefcase className="w-4 h-4 text-emerald-500" />
                    {staff.staffId}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-zinc-100">
              <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] mb-8">
                Contact & Network
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a
                  href={`mailto:${staff.email}`}
                  className="flex items-center gap-4 p-5 bg-zinc-50 rounded-3xl border border-zinc-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase mb-0.5">
                      Work Email
                    </p>
                    <p className="text-zinc-900 font-bold">{staff.email}</p>
                  </div>
                </a>
                <a
                  href={`tel:${staff.phoneNumber}`}
                  className="flex items-center gap-4 p-5 bg-zinc-50 rounded-3xl border border-zinc-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase mb-0.5">
                      Phone Number
                    </p>
                    <p className="text-zinc-900 font-bold">
                      {staff.phoneNumber}
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <div className="mt-12 p-8 bg-zinc-900 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-1">Official Regen Staff</h3>
                <p className="text-zinc-400">
                  This profile is managed and verified by PT Global Enak Nikmat.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-xs font-bold text-zinc-500 uppercase">
                    Staff Since
                  </p>
                  <p className="font-bold">
                    {new Date(staff.createdAt).getFullYear()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
