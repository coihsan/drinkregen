import db from "@/lib/db";

// export const createNewUser = async (email: string, password: string) => {
//   const existing = await db.user.findUnique({ where: { email } });
//   if (existing) throw new Error("User already exists");
//     const user = await db.user.create({ data: { email, role: "STAFF" } });
//     return user;
// };

export const getAllUsers = async () => {
    const users = await db.user.findMany();
    return users;
}