import React from 'react'
import EmployeeTable from './Components/EmployeeTable';
import EmployeeModal from './Components/EmployeeModal';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";

//export const backendUrl = 'http://localhost:4000/api/employee'
export const backendUrl = '/api/employee'

const App = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  async function fetchEmployeeDetails() {
    const url = debouncedSearch
      ? `${backendUrl}/search?q=${encodeURIComponent(debouncedSearch)}`
      : backendUrl;

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error);
    }
    return data;
  }

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["employee_details", debouncedSearch],
    queryFn: fetchEmployeeDetails,
    placeholderData: keepPreviousData,
  });

  if (isPending) {
    return (
      <div>Loading</div>
    )
  }

  if (isError) {
    return (
      <div>{error.message}</div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <div className='max-w-7xl mx-auto space-y-8'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-semibold justify-between'>Employee Management</h1>
          <EmployeeModal type='add'>
            <button className='px-5 py-2 rounded-xl bg-gray-100 text-gray-700 shadow-[4px_4px_8px_#c5c5c5, -4px_-4px_8px_#ffff]'>
              Add Employee</button>
            </EmployeeModal>
        </div>

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

        <EmployeeTable employees={data}/>
      </div>
    </div>
  )
}

export default App