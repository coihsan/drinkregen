import { SiteLink } from "@/lib/const";
import Link from "next/link";

interface QuickLinkProps {
  className?: string;
}

const QuickLink = ({ className }: QuickLinkProps) => {
  return (
    <nav>
      <ul className={className}>
        {SiteLink.map((item, key) => (
          <li key={key}>
            <Link className="text-normal sm:text-sm hover:text-yellow-400 transition-color duration-500" href={item.url}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default QuickLink