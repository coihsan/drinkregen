import { Input } from "@workspace/ui/components/input"
import { SearchIcon } from "lucide-react"

interface SearchBarProps {
  searchRef?: React.RefObject<HTMLInputElement>;
  searchQuery: (searchValues: string) => void;
}

const SearchBar = ({ searchRef, searchQuery }: SearchBarProps) => {
  return (
    <div className="flex items-center w-full max-w-sm space-x-2 rounded-lg border px-3.5">
      <SearchIcon className="h-4 w-4" />
      <Input
        ref={searchRef}
        type="search"
        placeholder="Search"
        className="w-full border-0 font-semibold ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-transparent"
        onChange={(e) => searchQuery(e.target.value)}
      />
    </div>
  )
}

export default SearchBar;