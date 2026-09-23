import { SiteLink } from "@/lib/const.web";

interface QuickLinkProps {
  className?: string;
}

const QuickLink = ({ className }: QuickLinkProps) => {
  return (
    <nav>
      <ul className={className}>
        {SiteLink.map((item, key) => (
          <li key={key}>
            <a className="hover:underline transition-color duration-500" href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default QuickLink;