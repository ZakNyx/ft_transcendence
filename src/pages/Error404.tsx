import React from 'react';

function Error404() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Oops.. Error 404</h1>
      <p className="text-lg text-gray-600">PAGE NOT FOUND</p>
    </div>
  );
}

export default Error404;