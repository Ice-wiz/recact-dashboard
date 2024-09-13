export const SearchBar = ({ onSearch }) => {
    const handleChange = (event) => {
      onSearch(event.target.value);
    };
  
    return (
      <div className="search-bar">
        <form>
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="flex items-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path
                d="M19 19l-4-4m0-7a7 7 0 1 1-14 0a7 7 0 0 1 14 0z"
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <input
              type="search"
              id="search"
              placeholder="Search by Name or ID"
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>
        </form>
      </div>
    );
  };
  