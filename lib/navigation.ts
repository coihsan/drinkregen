export const isNavigationActive = (pathname: string, href: string) => href === "/" ? pathname === "/" : href !== "#" && (pathname === href || pathname.startsWith(`${href}/`));
