import {
  HoverCardTrigger,
  HoverCardContent,
} from "@workspace/ui/components/hover-card";
import { HoverCard } from "@workspace/ui/components/hover-card";

interface WarningProps {
    message: string;
    icon: React.ReactNode;
}

const Warning : React.FC<WarningProps> = ({ message, icon }: WarningProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger>{icon}</HoverCardTrigger>
      <HoverCardContent>
        {message}
      </HoverCardContent>
    </HoverCard>
  );
};
export default Warning;
