import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const HomePage = async () => {
//   const session = await auth.api.getSession({ headers: await headers() })
//   if (!session) redirect("/sign-in")
  return redirect("/staff-directory")
}
export default HomePage;