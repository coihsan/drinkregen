import { de } from "@faker-js/faker";

interface StaffDetailListProps {
  title: string;
  name: string;
  icon: React.ReactNode;
}

const StaffDetailList = ({ title, name, icon }: StaffDetailListProps) => {
  return (
    <div className="flex items-center gap-4 rounded-3xl transition-all group">
      {icon}
      <div>
        <p className="text-xs mb-0.5">
          {title}
        </p>
        <span className="font-semibold">{name}</span>
      </div>
    </div>
  );
};
export default StaffDetailList;