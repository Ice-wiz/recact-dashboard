import { useState, useEffect } from "react";
import "./App.css";
import { Header } from "./components/header";
import { Content } from "./components/content";
import { records } from "./assets/data";

function App() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRecords, setSelectedRecords] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecords, setFilteredRecords] = useState(records);
  const [sourceFilters, setSourceFilters] = useState([]);
  const [listNameFilters, setListNameFilters] = useState([]);
  const [typeFilters, setTypeFilters] = useState([]);
  const [actionFilters, setActionFilters] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);

  // Define filter options with manual source and action options
  const filterOptions = {
    source: [
      { id: 1, name: "passlist" },
      { id: 2, name: "blocklist" },
      { id: 3, name: "reconlist" },
      { id: 4, name: "externallist" },
      { id: 5, name: "internallist" },
    ],
    listName: Array.from(new Set(records.map((record) => record.list_id))).map(
      (id) => ({
        id,
        name: records.find((record) => record.list_id === id).list_name,
      })
    ),
    type: Array.from(new Set(records.map((record) => record.record_type))).map(
      (type) => ({
        id: type,
        name: type,
      })
    ),
    action: [
      { id: 1, name: "add" },
      { id: 2, name: "put" },
      { id: 3, name: "remove" },
    ],
  };

  useEffect(() => {
    const applyFilters = () => {
      setIsLoading(true);
      setTimeout(() => {
        let filtered = records.filter((record) => {
          const matchesSearch = 
            searchTerm.length < 3 || 
            record.list_entry_id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.primary_name.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesSource =
            sourceFilters.length === 0 ||
            sourceFilters.includes(record.list_type_id);

          const matchesListName =
            listNameFilters.length === 0 ||
            listNameFilters.includes(record.list_id);

          const matchesType =
            typeFilters.length === 0 || typeFilters.includes(record.record_type);

          const matchesAction =
            actionFilters.length === 0 ||
            actionFilters.includes(record.action_id);

          return (
            matchesSearch &&
            matchesSource &&
            matchesListName &&
            matchesType &&
            matchesAction
          );
        });

        filtered.sort((a, b) => {
          if (sortOrder === "asc") {
            return a.list_entry_id.localeCompare(b.list_entry_id, undefined, {
              numeric: true,
            });
          } else {
            return b.list_entry_id.localeCompare(a.list_entry_id, undefined, {
              numeric: true,
            });
          }
        });

        setFilteredRecords(filtered);
        setPage(0);

        setSelectedRecords((prev) => {
          const newSelected = new Set();
          filtered.forEach((record) => {
            if (prev.has(record.list_entry_id)) {
              newSelected.add(record.list_entry_id);
            }
          });
          return newSelected;
        });

        setIsLoading(false);
      }, 500); // Simulate loading delay
    };

    applyFilters();
  }, [
    searchTerm,
    sourceFilters,
    listNameFilters,
    typeFilters,
    actionFilters,
    sortOrder,
  ]);

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleNext = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrev = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const toggleSelectAll = (isChecked) => {
    if (isChecked) {
      const newSelections = new Set(selectedRecords);
      filteredRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).forEach((record) => {
        newSelections.add(record.list_entry_id);
      });
      setSelectedRecords(newSelections);
    } else {
      const newSelections = new Set(selectedRecords);
      filteredRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).forEach((record) => {
        newSelections.delete(record.list_entry_id);
      });
      setSelectedRecords(newSelections);
    }
  };

  const toggleSelectRecord = (id) => {
    setSelectedRecords((prev) => {
      const newSelections = new Set(prev);
      if (newSelections.has(id)) {
        newSelections.delete(id);
      } else {
        newSelections.add(id);
      }
      return newSelections;
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedRecords(new Set());
    setPage(0);
    setSourceFilters([]);
    setListNameFilters([]);
    setTypeFilters([]);
    setActionFilters([]);
    setFilteredRecords(records);
  };

  const handleFilterChange = (filterType, value) => {
    const updateFilter = (prevFilters) =>
      prevFilters.includes(value)
        ? prevFilters.filter((v) => v !== value)
        : [...prevFilters, value];

    switch (filterType) {
      case "source":
        setSourceFilters((prev) => updateFilter(prev));
        break;
      case "listName":
        setListNameFilters((prev) => updateFilter(prev));
        break;
      case "type":
        setTypeFilters((prev) => updateFilter(prev));
        break;
      case "action":
        setActionFilters((prev) => updateFilter(prev));
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="p-4">
        <Header totalRecords={records.length} />
        <Content
          props={{
            onPage: filteredRecords.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
            page: page,
            rowsPerPage: rowsPerPage,
            setRowsPerPage: setRowsPerPage,
            totalRecords: filteredRecords.length,
            onNext: handleNext,
            onPrev: handlePrev,
            toggleSelectAll: toggleSelectAll,
            toggleSelectRecord: toggleSelectRecord,
            selectedRecords: selectedRecords,
            setSearchTerm: setSearchTerm,
            onReset: handleReset,
            filterOptions: filterOptions,
            sourceFilters: sourceFilters,
            listNameFilters: listNameFilters,
            typeFilters: typeFilters,
            actionFilters: actionFilters,
            handleFilterChange: handleFilterChange,
            sortOrder: sortOrder,
            handleSort: handleSort,
            isLoading: isLoading,
          }}
        />
      </div>
    </>
  );
}

export default App;