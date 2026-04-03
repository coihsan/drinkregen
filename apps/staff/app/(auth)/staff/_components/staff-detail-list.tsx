import { de } from "@faker-js/faker";
import InputCopy from "./input-copy";

interface StaffDetailListProps {
  title: string;
  name: string;
  icon: React.ReactNode;
}

const StaffDetailList = ({ title, name, icon }: StaffDetailListProps) => {
  return (
    <div className="flex items-center gap-4 rounded-3xl transition-all group">
      <p className="text-xs mb-0.5">{title}</p>
      {icon}
      <InputCopy value={name} />
    </div>
  );
};
export default StaffDetailList;
