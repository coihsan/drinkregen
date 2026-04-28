import { SiteLink } from "@/lib/const";
import NavItem from "./nav-item";
import LogoRegen from "../global/logo";
import { Button } from "@workspace/ui/components/button";
import { Menu } from "lucide-react";

const SiteHeader = () => {
  
  return (
    <div className="sticky top-0 left-0 mx-auto w-full z-100">
      <header className="flex items-center justify-between py-6 px-5">
        <div>
          <LogoRegen isLink width={140} height={20} />
        </div>
        <nav className="flex items-center gap-1 border gap-4 rounded-full px-6 py-4 shadow-md bg-white">
          {SiteLink.map((item, key) => (
            <NavItem key={key} title={item.title} url={item.url} />
          ))}
        </nav>
        <div>
          <Button className="scale-120" variant={'default'} size={'lg'}><Menu /></Button>
        </div>
      </header>
    </div>
  );
};
export default SiteHeader;
