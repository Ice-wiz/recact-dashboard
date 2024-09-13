import React, { useState } from "react";
import { SearchBar } from "../ui/searchBar";
import { Element } from "./element";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

export const Content = ({ props }) => {
  const [openFilter, setOpenFilter] = useState(null);

  const isAllSelected =
    props.onPage.filter((record) =>
      props.selectedRecords.has(record.list_entry_id)
    ).length === props.onPage.length;

  const FilterDropdown = ({ options, selectedFilters, onChange, filterType }) => {
    const isOpen = openFilter === filterType;
    const hasActiveFilters = selectedFilters.length > 0;

    return (
      <div className="relative">
        <button
          className={`flex items-center space-x-1 p-1 rounded ${hasActiveFilters ? 'text-blue-600' : 'text-gray-600'}`}
          onClick={() => setOpenFilter(isOpen ? null : filterType)}
        >
          <Filter size={16} />
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {options.map((option) => (
                <label key={option.id || option} className="flex items-center px-4 py-2 hover:bg-gray-100">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={selectedFilters.includes(option.id || option)}
                    onChange={() => onChange(filterType, option.id || option)}
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.name || option}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <SearchBar onSearch={props.setSearchTerm} />
        <button
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={props.onReset}
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

      {props.isLoading ? (
        <div className="animate-pulse">
          {[...Array(props.rowsPerPage)].map((_, index) => (
            <div key={index} className="h-16 bg-gray-200 mb-2 rounded"></div>
          ))}
        </div>
      ) : (
        <table className="min-w-full text-left table-auto">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">
                <div className="flex items-center">
                  <input
                    className="mr-2"
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => props.toggleSelectAll(e.target.checked)}
                  />
                  <button
                    className="flex items-center"
                    onClick={props.handleSort}
                  >
                    Record ID
                    {props.sortOrder === "asc" ? (
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
                    options={props.filterOptions.source}
                    selectedFilters={props.sourceFilters}
                    onChange={props.handleFilterChange}
                    filterType="source"
                  />
                </div>
              </th>
              <th className="p-4">
                <div className="flex items-center space-x-2">
                  <span>List Name</span>
                  <FilterDropdown
                    options={props.filterOptions.listName}
                    selectedFilters={props.listNameFilters}
                    onChange={props.handleFilterChange}
                    filterType="listName"
                  />
                </div>
              </th>
              <th className="p-4">
                <div className="flex items-center space-x-2">
                  <span>Type</span>
                  <FilterDropdown
                    options={props.filterOptions.type}
                    selectedFilters={props.typeFilters}
                    onChange={props.handleFilterChange}
                    filterType="type"
                  />
                </div>
              </th>
              <th className="p-4">
                <div className="flex items-center space-x-2">
                  <span>Action</span>
                  <FilterDropdown
                    options={props.filterOptions.action}
                    selectedFilters={props.actionFilters}
                    onChange={props.handleFilterChange}
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
            {props.onPage.map((record, index) => (
              <Element
                key={index}
                props={{
                  recordId: record.list_entry_id,
                  source: props.filterOptions.source.find(s => s.id === record.list_type_id)?.name || 'Unknown',
                  listName: props.filterOptions.listName.find(l => l.name === record.list_name)?.name || 'Unknown',
                  type: record.record_type,
                  action: props.filterOptions.action.find(a => a.id === record.action_id)?.name || 'Unknown',
                  name: record.primary_name,
                  createdBy: record.added_user_id,
                  claimedBy: record.claimed_by_id,
                  isChecked: props.selectedRecords.has(record.list_entry_id),
                  toggleSelectRecord: () =>
                    props.toggleSelectRecord(record.list_entry_id),
                }}
              />
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-between items-center mt-6">
        <div className="text-gray-600">
          Selected {props.selectedRecords.size} of {props.totalRecords}
        </div>
        <div className="flex items-center space-x-4">
          <select
            className="p-2 border rounded"
            value={props.rowsPerPage}
            onChange={(e) => props.setRowsPerPage(Number(e.target.value))}
          >
            {[5, 10, 15, 20].map((value) => (
              <option key={value} value={value}>
                {value} rows
              </option>
            ))}
          </select>
          <span className="text-gray-600">
            {props.page * props.rowsPerPage + 1}-{Math.min((props.page + 1) * props.rowsPerPage, props.totalRecords)} of {props.totalRecords}
          </span>
          <button
            className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            onClick={props.onPrev}
            disabled={props.page === 0}
          >
            Prev
          </button>
          <button
            className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            onClick={props.onNext}
            disabled={props.page >= Math.ceil(props.totalRecords / props.rowsPerPage) - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};