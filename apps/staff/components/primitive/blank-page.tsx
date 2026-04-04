import { Button } from "@workspace/ui/components/button";

interface BlankPageProps {
    title: string;
    description?: string;
    backUrl?: string;
}
const BlankPage = ({ title, description }: BlankPageProps) => {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-500">{title}</h1>
                {description && <p className="text-gray-500 mt-2">{description}</p>}
                <Button size={'lg'} variant={"outline"} className="mt-4" onClick={() => window.history.back()}>
                    Go Back
                </Button>
            </div>
        </div>
    )
}
export default BlankPage;