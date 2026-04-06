interface SubHeaderProps {
  title: string;
  children?: React.ReactNode;
}
const SubHeader = ({ title, children }: SubHeaderProps) => {
  return (
    <div className="flex-none sm:flex items-center justify-between mb-4 sticky top-0 right-0 left-0">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="flex items-center gap-1 mt-2 sm:mt-0">{children}</div>
    </div>
  );
};
export default SubHeader;
