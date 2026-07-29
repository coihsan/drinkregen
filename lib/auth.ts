import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, twoFactor } from "better-auth/plugins";
import { defaultRoles } from "better-auth/plugins/admin/access";
import prisma from "@/lib/db";

const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_APP_URL,
  "http://localhost:3000",
].filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  appName: "Regen Staff",
  plugins: [
    admin({
      defaultRole: "staff",
      roles: {
        ...defaultRoles,
        staff: defaultRoles.user,
        superadmin: defaultRoles.admin,
      },
      adminRoles: ["admin", "superadmin"],
    }),
    twoFactor({}),
  ],

  emailAndPassword: {
    enabled: true,
    rememberMe: true,
  },
  trustedOrigins,
});
