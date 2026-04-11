import { SiteLink } from "@/lib/const";
import Link from "next/link";

const QuickLink = () => {
  return (
    <nav>
      <ul>
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