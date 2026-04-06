const parseProtectedAdminEmails = () => {
  const rawValue = process.env.PROTECTED_ADMIN_EMAILS ?? "";

  return new Set(
    rawValue
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
};

export const protectedAdminEmails = parseProtectedAdminEmails();
