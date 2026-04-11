import { InputGroup, InputGroupAddon, InputGroupInput } from "@workspace/ui/components/input-group";
import { Search } from "lucide-react";
import { ReactNode } from "react";

interface SearchBarProps {
  className?: string;
  searchRef?: React.RefObject<HTMLInputElement>;
  searchQuery: (searchValues: string) => void;
  totalIndex?: ReactNode;
  placeHolder?: string
}

const SearchBar = ({ searchRef, searchQuery, className, totalIndex, placeHolder }: SearchBarProps) => {
  return (
    <InputGroup className={`${className}`}>
      <InputGroupInput
        type="search"
        ref={searchRef}
        placeholder={placeHolder || "Search..."}
        onChange={(e) => searchQuery(e.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">{totalIndex}</InputGroupAddon>
    </InputGroup>
  );
};

export default SearchBar;
