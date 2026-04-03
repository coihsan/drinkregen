import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, twoFactor } from "better-auth/plugins";
import prisma from "@/lib/db";
import { ROLE } from "@/types/enums";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  appName: "Regen Staff",
  plugins: [
    admin({
      defaultRole: "staff",
      adminRoles: ["admin"],
    }),
    twoFactor({}),
  ],

  emailAndPassword: {
    enabled: true,
    rememberMe: true,
  },
  trustedOrigins: ["http://localhost:3000"], 
});