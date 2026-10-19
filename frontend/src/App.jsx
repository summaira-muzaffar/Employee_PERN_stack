import React, { useState, useEffect } from 'react';
import EmployeeTable from './Components/EmployeeTable';
import EmployeeModal from './Components/EmployeeModal';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { FaSearch } from "react-icons/fa";

// This relative path is perfect for Vercel.
// It will hit the Vite proxy locally, and the Vercel rewrite in production.
export const backendUrl = '/api/employee';

const App = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch logic
  async function fetchEmployeeDetails() {
    const url = debouncedSearch
      ? `${backendUrl}/search?q=${encodeURIComponent(debouncedSearch)}`
      : backendUrl;

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      // Fallback in case the backend doesn't send data.error
      throw new Error(data.error || "Failed to fetch employees");
    }
    return data;
  }

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["employee_details", debouncedSearch],
    queryFn: fetchEmployeeDetails,
    placeholderData: keepPreviousData, 
  });

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <div className='max-w-7xl mx-auto space-y-8'>
        
        {/* Header */}
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-semibold justify-between'>Employee Management</h1>
          <EmployeeModal type='add'>
            <button className='px-5 py-2 rounded-xl bg-gray-100 text-gray-700 shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffff]'>
              Add Employee
            </button>
          </EmployeeModal>
        </div>

        {/* Search Bar */}
        <div className='relative max-w-md'>
          <FaSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full pl-11 pr-4 py-2 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-blue-400 border-0'
          />
        </div>

        {/* Dynamic Content Area */}
        <div>
          {/* 1. Loading State */}
          {isPending && (
            <div className="text-center py-10 text-gray-500 animate-pulse">
              Loading employees...
            </div>
          )}

          {/* 2. Error State */}
          {isError && (
            <div className="text-center py-10 text-red-500 bg-red-50 rounded-xl border border-red-200">
              <p>Error: {error.message}</p>
              <p className="text-sm text-gray-500 mt-2">Make sure your backend is running and DATABASE_URL is set.</p>
            </div>
          )}

          {/* 3. Success State */}
          {!isPending && !isError && (
            <EmployeeTable employees={data} />
          )}
        </div>

      </div>
    </div>
  )
}

export default App;
