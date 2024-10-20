import React, { useState } from 'react';

const initialOrders = [
  {
    id: 1,
    orderId: 'FF000000001',
    status: 'To Pay',
    total: 1000,
    products: ['Product 1', 'Product 2', 'Product 3'],
  },
  {
    id: 2,
    orderId: 'FF000000002',
    status: 'To Ship',
    total: 1200,
    products: ['Product 4', 'Product 5'],
  },
  {
    id: 3,
    orderId: 'FF000000003',
    status: 'Completed',
    total: 500,
    products: ['Product 6'],
  },
  {
    id: 4,
    orderId: 'FF000000004',
    status: 'Return/Refund',
    total: 700,
    products: ['Product 7', 'Product 8'],
  },
];

const StatusPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredOrders =
    selectedStatus === 'All'
      ? initialOrders
      : initialOrders.filter(order => order.status === selectedStatus);

  return (
    <div className='bg-black min-h-screen text-white p-8'>
      <h1 className='text-4xl font-bold mb-8'>Status</h1>

      {/* Status Filter */}
      <div className='flex space-x-4 mb-8'>
        {['All', 'To Pay', 'To Ship', 'Completed', 'Return/Refund'].map(status => (
          <button
            key={status}
            className={`px-4 py-2 rounded ${
              selectedStatus === status ? 'bg-blue-500' : 'bg-gray-700'
            }`}
            onClick={() => setSelectedStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {filteredOrders.map(order => (
        <div key={order.id} className='mb-8'>
          <h2 className='text-xl font-bold mb-4'>
            Order {order.orderId} - {order.status}
          </h2>
          <table className='w-full text-left bg-gray-800 rounded-lg'>
            <thead className='bg-gray-700'>
              <tr>
                <th className='p-4'>Product</th>
                <th className='p-4'>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((product, index) => (
                <tr key={index} className='border-t border-gray-600'>
                  <td className='p-4'>{product}</td>
                  <td className='p-4'>B {order.total / order.products.length}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className='mt-4 flex justify-between'>
            <button className='bg-blue-500 text-white px-4 py-2 rounded'>
              Pay Now
            </button>
            <div className='text-lg'>
              Order Total: <span className='font-bold'>B {order.total}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusPage;
