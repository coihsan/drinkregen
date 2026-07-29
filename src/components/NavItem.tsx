interface NavMainProps {
  url: string;
  title: string;
  className?: string;
  onClick?: () => void;
}

const NavItem = ({ url, title, className, onClick }: NavMainProps) => {
  return (
    <a href={url} className={`relative font-semibold ${className}`} onClick={onClick}>
      {title}
    </a>
  );
};
export default NavItem;
