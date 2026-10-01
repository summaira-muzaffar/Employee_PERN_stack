import React from 'react'
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import EmployeeModal from './EmployeeModal';
import { useMutation } from '@tanstack/react-query';
import { backendUrl } from '../App';
import { queryClient } from '../utils/queryClients';
import toast from "react-hot-toast";

const EmployeeTable = ({ employees }) => {

  const mutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${backendUrl}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      const results = await response.json();

      if (!response.ok) throw new Error(results.error)

      return results
    },

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["employee_details"] });

      const previousData = queryClient.getQueriesData({ queryKey: ["employee_details"] });

      queryClient.setQueriesData({ queryKey: ["employee_details"] }, (old) =>
        old ? old.filter((emp) => emp.id !== id) : old
      );

      return { previousData };
    },

    onError: (error, id, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(error.message);
    },

    onSuccess: () => {
      toast.success("Employee deleted");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["employee_details"] });
    },
  })

  if (!employees?.length) {
    return (
      <div>No employee data available</div>
    )
  }

  return (
    <div className='w-full overflow-x-auto'>
      <div className='min-w-225 bg-gray-100 rounded-xl p-6'>
        <table className='w-full'>
          <thead>
            <tr className='text-left text-sm text-gray-600'>
              <th className='py-3 px-4'>ID</th>
              <th className='py-3 px-4'>Name</th>
              <th className='py-3 px-4'>Email</th>
              <th className='py-3 px-4'>Age</th>
              <th className='py-3 px-4'>Role</th>
              <th className='py-3 px-4'>Salary</th>
              <th className='py-3 px-4'>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((item) => (
              <tr key={item.id} className='text-sm text-gray-700 rounded-2xl transition hover:bg-gray-200/60 shadow-[inset_1px_1px_2px_#e5e5e5]'>
                <td className='py-4 px-4'>{item.id}</td>
                <td className='py-4 px-4'>{item.name}</td>
                <td className='py-4 px-4'>{item.email}</td>
                <td className='py-4 px-4'>{item.age}</td>
                <td className='py-4 px-4'>{item.role}</td>
                <td className='py-4 px-4'>{item.salary}</td>
                <td className='py-4 px-4'>
                  <div className='flex items-center gap-4'>
                    <button
                      onClick={() => mutation.mutate(item.id)}
                      disabled={mutation.isPending}
                      className='p-2 rounded-lg bg-gray-100 shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff] hover:shadow-inner text-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      <MdDelete />
                    </button>
                    <EmployeeModal data={item} type='update'>
                      <button className='p-2 rounded-lg bg-gray-100 shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff] hover:shadow-inner text-green-600 transition'><FaRegEdit /></button>
                    </EmployeeModal>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EmployeeTable