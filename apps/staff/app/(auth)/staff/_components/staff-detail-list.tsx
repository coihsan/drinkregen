import InputCopy from "./input-copy";

interface StaffDetailListProps {
  title: string;
  name: string;
  icon: React.ReactNode;
}

const StaffDetailList = ({ title, name, icon }: StaffDetailListProps) => {
  return (
    <div className="w-full transition-all group relative">
      <p className="text-xs font-semibold left-8 mb-0.5 absolute -top-3 accent-foreground rounded-full px-2 py-0">{title}</p>
      <div className="flex items-center gap-2 w-full">
      {icon}
        <InputCopy value={name} />
      </div>
    </div>
  );
};
export default StaffDetailList;
