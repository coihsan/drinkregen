export const getNameStaff = (name: string) => {
  const parts = name.trim().split(" ");
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    } else {
        return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
    }
}

export const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
}