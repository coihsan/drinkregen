import { SiteLink } from "@/lib/const";
import NavItem from "./nav-item";
import LogoRegen from "../global/logo";

const SiteHeader = () => {
  return (
    <header className="flex items-center justify-between w-full p-6 border-b-2 border-lime-500">
        <div>
            <LogoRegen width={140} height={20} />
        </div>
      <nav className="flex items-center gap-1">
        {SiteLink.map((item, key) => (
          <NavItem key={key} title={item.title} url={item.url} />
        ))}
      </nav>
    </header>
  );
};
export default SiteHeader;
