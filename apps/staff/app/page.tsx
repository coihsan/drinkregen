"use client";

import { redirect } from "next/navigation";
import { useRouter } from "next/navigation"; 
import { useSession } from "@/lib/auth-client"; 
import { useEffect } from "react";
import { Loading } from "@workspace/ui/components/loading";
import { STAFF_PREFIX } from "@/types/path.types";

const HomePage = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);
  if (isPending)
    return <div className="w-full h-screen flex items-center justify-center"><Loading className="h-32 w-32" /></div>; 
  if (!session?.user)
    return <p className="text-center flex items-center justify-center h-full w-full text-white">Redirecting...</p>; 
    return redirect(STAFF_PREFIX)

}
export default HomePage;