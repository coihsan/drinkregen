import { auth } from "../lib/auth"
import db from "../lib/db";


async function main() {
  const existing = await db.user.findUnique({
    where: { email: "superadmin@webkantor.com" },
  })

  if (existing) {
    console.log("⚠️  Superadmin sudah ada, seed dilewati.")
    return
  }
  
  await auth.api.createUser({
    body: {
      name: "Super Admin",
      email: "superadmin@webkantor.com",
      password: "GantiPasswordIni123!",
      role: "admin",

    },
  })

  console.log("✅ Superadmin berhasil dibuat.")
  console.log("📧 Email   : superadmin@webkantor.com")
  console.log("🔑 Password: GantiPasswordIni123!")
  console.log("⚠️  Segera ganti password setelah login pertama!")
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())