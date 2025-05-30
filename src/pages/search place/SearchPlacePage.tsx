import { useNavigate, useParams } from "react-router-dom";
import useTitle from "../../hooks/useChangePageTitle";
import AllPlacesSection from "../homePage/AllPlaces/AllPlacesSection";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function SearchPlacePage() {
  const { query } = useParams();
  useTitle(`Search - ${query}`);
  const [searchQuery, setSearchQuery] = useState(query || "");

  const nav = useNavigate();
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && searchQuery.trim() !== query) {
      nav(`/search-places/${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  useEffect(() => {
    setSearchQuery(query || "");
  }, [query]);

  return (
    <div>
      <div className="mt-8 w-full max-w-2xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for places, find it here..."
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 shadow-lg"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg font-medium flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </form>
      </div>
      <AllPlacesSection query={query} />
    </div>
  );
}
