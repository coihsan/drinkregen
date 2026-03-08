const RootStaffLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full max-w-2xl mx-auto">
        <div className="w-3/4 p-4">
            {children}
        </div>
    </div>
  );
}
export default RootStaffLayout;