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
            <Link href={item.url}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default QuickLink