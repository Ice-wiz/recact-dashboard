import React, { useState, useMemo } from "react";
import { SearchBar } from "../ui/searchBar";
import { Element } from "./element";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

export const Content = ({
  onPage,
  page,
  rowsPerPage,
  setRowsPerPage,
  totalRecords,
  onNext,
  onPrev,
  toggleSelectAll,
  toggleSelectRecord,
  selectedRecords,
  setSearchTerm,
  onReset,
  filterOptions,
  sourceFilters,
  listNameFilters,
  typeFilters,
  actionFilters,
  handleFilterChange,
  sortOrder,
  handleSort,
  isLoading,
  error,
}) => {
  const [openFilter, setOpenFilter] = useState(null);

  const isAllSelected = onPage && onPage.length > 0 && onPage.every((record) => selectedRecords.has(record.list_entry_id));

  const FilterDropdown = ({ options, selectedFilters, onChange, filterType }) => {
    const isOpen = openFilter === filterType;
    const hasActiveFilters = selectedFilters && selectedFilters.length > 0;

    return (
      <div className="relative">
        <button
          className={`flex items-center space-x-1 p-1 rounded ${hasActiveFilters ? 'text-blue-600' : 'text-gray-600'}`}
          onClick={() => setOpenFilter(isOpen ? null : filterType)}
        >
          <Filter size={16} />
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {isOpen && options && (
          <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {options.map((option) => (
                <label key={option.id} className="flex items-center px-4 py-2 hover:bg-gray-100">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={selectedFilters.includes(option.id)}
                    onChange={() => onChange(filterType, option.id)}
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const filteredRecords = useMemo(() => {
    return onPage.filter(record => {
      const sourceMatch = sourceFilters.length === 0 || sourceFilters.includes(record.list_type_id);
      const listNameMatch = listNameFilters.length === 0 || listNameFilters.includes(record.list_id);
      const typeMatch = typeFilters.length === 0 || typeFilters.includes(record.record_type);
      const actionMatch = actionFilters.length === 0 || actionFilters.includes(record.action_id);
      return sourceMatch && listNameMatch && typeMatch && actionMatch;
    });
  }, [onPage, sourceFilters, listNameFilters, typeFilters, actionFilters]);

  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      const compareResult = a.list_entry_id.localeCompare(b.list_entry_id);
      return sortOrder === "asc" ? compareResult : -compareResult;
    });
  }, [filteredRecords, sortOrder]);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <SearchBar onSearch={setSearchTerm} />
        <button
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={onReset}
          title="Reset Filters"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {isLoading ? (
        <div className="animate-pulse">
          {[...Array(rowsPerPage)].map((_, index) => (
            <div key={index} className="h-16 bg-gray-200 mb-2 rounded"></div>
          ))}
        </div>
      ) : sortedRecords.length > 0 ? (
        <table className="min-w-full text-left table-auto">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">
                <div className="flex items-center">
                  <input
                    className="mr-2"
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                  />
                  <button
                    className="flex items-center"
                    onClick={handleSort}
                  >
                    Record ID
                    {sortOrder === "asc" ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronUp size={16} />
                    )}
                  </button>
                </div>
              </th>
              <th className="p-4">
                <div className="flex items-center space-x-2">
                  <span>Source</span>
                  <FilterDropdown
                    options={filterOptions.source}
                    selectedFilters={sourceFilters}
                    onChange={handleFilterChange}
                    filterType="source"
                  />
                </div>
              </th>
              <th className="p-4">
                <div className="flex items-center space-x-2">
                  <span>List Name</span>
                  <FilterDropdown
                    options={filterOptions.listName}
                    selectedFilters={listNameFilters}
                    onChange={handleFilterChange}
                    filterType="listName"
                  />
                </div>
              </th>
              <th className="p-4">
                <div className="flex items-center space-x-2">
                  <span>Type</span>
                  <FilterDropdown
                    options={filterOptions.type}
                    selectedFilters={typeFilters}
                    onChange={handleFilterChange}
                    filterType="type"
                  />
                </div>
              </th>
              <th className="p-4">
                <div className="flex items-center space-x-2">
                  <span>Action</span>
                  <FilterDropdown
                    options={filterOptions.action}
                    selectedFilters={actionFilters}
                    onChange={handleFilterChange}
                    filterType="action"
                  />
                </div>
              </th>
              <th className="p-4">Name</th>
              <th className="p-4">Created By</th>
              <th className="p-4">Claimed By</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.map((record) => (
              <Element
                key={record.list_entry_id}
                props={{
                  recordId: record.list_entry_id,
                  source: filterOptions.source.find(s => s.id === record.list_type_id)?.name || 'Unknown',
                  listName: filterOptions.listName.find(l => l.id === record.list_id)?.name || 'Unknown',
                  type: record.record_type,
                  action: filterOptions.action.find(a => a.id === record.action_id)?.name || 'Unknown',
                  name: record.primary_name,
                  createdBy: record.added_user_id,
                  claimedBy: record.claimed_by_id,
                  isChecked: selectedRecords.has(record.list_entry_id),
                  toggleSelectRecord: () => toggleSelectRecord(record.list_entry_id),
                }}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-4">No records found</div>
      )}

      <div className="flex justify-between items-center mt-6">
        <div className="text-gray-600">
          Selected {selectedRecords.size} of {totalRecords}
        </div>
        <div className="flex items-center space-x-4">
          <select
            className="p-2 border rounded"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            {[5, 10, 15, 20].map((value) => (
              <option key={value} value={value}>
                {value} rows
              </option>
            ))}
          </select>
          <span className="text-gray-600">
            {totalRecords > 0 ? `${(page - 1) * rowsPerPage + 1}-${Math.min(page * rowsPerPage, totalRecords)} of ${totalRecords}` : '0 of 0'}
          </span>
          <button
            className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            onClick={onPrev}
            disabled={page === 1}
          >
            Prev
          </button>
          <button
            className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            onClick={onNext}
            disabled={page >= Math.ceil(totalRecords / rowsPerPage)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};