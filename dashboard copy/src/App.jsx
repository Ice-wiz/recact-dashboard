import { useState, useEffect } from "react";
import "./App.css";
import { Header } from "./components/header";
import { Content } from "./components/content";
import axios from "axios";

function App() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRecords, setSelectedRecords] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sourceFilters, setSourceFilters] = useState([]);
  const [listNameFilters, setListNameFilters] = useState([]);
  const [typeFilters, setTypeFilters] = useState([]);
  const [actionFilters, setActionFilters] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filterOptions, setFilterOptions] = useState({
    source: [],
    listName: [],
    type: [],
    action: []
  });

  useEffect(() => {
    fetchRecords();
  }, [page, rowsPerPage, searchTerm, sourceFilters, listNameFilters, typeFilters, actionFilters, sortOrder]);

  const fetchRecords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/records', {
        params: {
          searchTerm,
          page,
          limit: rowsPerPage,
          sourceFilters: sourceFilters.join(','),
          listNameFilters: listNameFilters.join(','),
          typeFilters: typeFilters.join(','),
          actionFilters: actionFilters.join(','),
          sortOrder
        }
      });
      if (response.data && Array.isArray(response.data.data)) {
        setRecords(response.data.data);
        setTotalRecords(response.data.totalRecords || 0);
        setTotalPages(response.data.totalPages || 0);
        updateFilterOptions(response.data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error("Error fetching records:", error);
      setError("Failed to fetch records. Please try again.");
      setRecords([]);
      setTotalRecords(0);
      setTotalPages(0);
    }
    setIsLoading(false);
  };

  const updateFilterOptions = (data) => {
    if (!Array.isArray(data)) {
      console.error("Invalid data format for updateFilterOptions");
      return;
    }
    const newFilterOptions = {
      source: Array.from(new Set(data.map(record => record.list_type_id))).map(id => ({
        id,
        name: getSourceName(id)
      })),
      listName: Array.from(new Set(data.map(record => record.list_id))).map(id => ({
        id,
        name: data.find(record => record.list_id === id)?.list_name || 'Unknown'
      })),
      type: Array.from(new Set(data.map(record => record.record_type))).map(type => ({
        id: type,
        name: type
      })),
      action: Array.from(new Set(data.map(record => record.action_id))).map(id => ({
        id,
        name: getActionName(id)
      }))
    };
    setFilterOptions(newFilterOptions);
  };

  const getSourceName = (id) => {
    const sourceMap = {
      1: "passlist",
      2: "blocklist",
      3: "reconlist",
      4: "externallist",
      5: "internallist"
    };
    return sourceMap[id] || "Unknown";
  };
  
  const getActionName = (id) => {
    const actionMap = {
      1: "add",
      2: "put",
      3: "remove"
    };
    return actionMap[id] || "Unknown";
  };
  
  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  
  const handleNext = () => {
    setPage(prevPage => Math.min(prevPage + 1, totalPages));
  };
  
  const handlePrev = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1));
  };
  
  const toggleSelectAll = (isChecked) => {
    if (isChecked) {
      const newSelections = new Set(selectedRecords);
      records.forEach(record => newSelections.add(record.list_entry_id));
      setSelectedRecords(newSelections);
    } else {
      setSelectedRecords(new Set());
    }
  };
  
  const toggleSelectRecord = (id) => {
    setSelectedRecords(prev => {
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
    setPage(1);
    setSourceFilters([]);
    setListNameFilters([]);
    setTypeFilters([]);
    setActionFilters([]);
    setSortOrder("asc");
  };
  
  const handleFilterChange = (filterType, value) => {
    const updateFilter = (prevFilters, newValue) => {
      const updatedFilters = prevFilters.includes(newValue)
        ? prevFilters.filter((v) => v !== newValue)
        : [...prevFilters, newValue];
      
      setSelectedRecords(prev => {
        const newSelections = new Set(prev);
        records.forEach(record => {
          const matchesFilters = (
            (updatedFilters.length === 0 || updatedFilters.includes(record.list_type_id)) &&
            (listNameFilters.length === 0 || listNameFilters.includes(record.list_id)) &&
            (typeFilters.length === 0 || typeFilters.includes(record.record_type)) &&
            (actionFilters.length === 0 || actionFilters.includes(record.action_id))
          );
          if (!matchesFilters) {
            newSelections.delete(record.list_entry_id);
          }
        });
        return newSelections;
      });

      return updatedFilters;
    };

    switch (filterType) {
      case "source":
        setSourceFilters(prev => updateFilter(prev, value));
        break;
      case "listName":
        setListNameFilters(prev => updateFilter(prev, value));
        break;
      case "type":
        setTypeFilters(prev => updateFilter(prev, value));
        break;
      case "action":
        setActionFilters(prev => updateFilter(prev, value));
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="p-4">
        <Header totalRecords={totalRecords} />
        <Content
          onPage={records}
          page={page}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalRecords={totalRecords}
          onNext={handleNext}
          onPrev={handlePrev}
          toggleSelectAll={toggleSelectAll}
          toggleSelectRecord={toggleSelectRecord}
          selectedRecords={selectedRecords}
          setSearchTerm={setSearchTerm}
          onReset={handleReset}
          filterOptions={filterOptions}
          sourceFilters={sourceFilters}
          listNameFilters={listNameFilters}
          typeFilters={typeFilters}
          actionFilters={actionFilters}
          handleFilterChange={handleFilterChange}
          sortOrder={sortOrder}
          handleSort={handleSort}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </>
  );
}

export default App;