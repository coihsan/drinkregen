interface SubHeaderProps {
  title: string;
  children?: React.ReactNode;
}
const SubHeader = ({ title, children }: SubHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4 sticky top-0 right-0 left-0">
      <p>
        <span>{title}</span>
      </p>
      <div className="flex items-center gap-1">
        {children}
      </div>
    </div>
  );
};
export default SubHeader;
