import InputCopy from "./input-copy";

interface StaffDetailListProps {
  title: string;
  name: string;
  icon: React.ReactNode;
}

const StaffDetailList = ({ title, name, icon }: StaffDetailListProps) => {
  return (
    <div className="w-fullrounded-3xl transition-all group">
      <p className="text-xs mb-0.5">{title}</p>
      <div className="flex items-center gap-2 w-full">
        {icon}
        <InputCopy value={name} />
      </div>
    </div>
  );
};
export default StaffDetailList;
