import { Line } from "../ui/line";

export const Header = ({ totalRecords }) => {
  return (
    <div className="p-4 bg-white shadow-sm">
      <div className="flex space-x-4 mb-4">
        <button className="bg-yellow-700 hover:bg-yellow-800 text-white font-medium py-1.5 px-6 rounded-md">
          Pending L1 ({totalRecords})
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 px-6 rounded-md">
          Rejected (0)
        </button>
        <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-1.5 px-6 rounded-md">
          Overdue (0)
        </button>
      </div>

      <div className="inline-flex space-x-4 mb-2">
        <button className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:bg-blue-700">
          Internal Records (0)
        </button>
        <button className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300">
          External Records (0)
        </button>
        <button className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300">
          Lists Configuration (0)
        </button>
        <button className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300">
          Templates (0)
        </button>
      </div>

      <Line />
    </div>
  );
};
