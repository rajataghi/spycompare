import React, { useState } from 'react';
import FeatureRequestModal from './FeatureRequestModal';

const MyAppBar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleFeatureRequestClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      {/* AppBar */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-20">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Menu Icon */}
          <button
            onClick={toggleDrawer}
            className="lg:hidden p-2 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          {/* Title */}
          <h1 className="text-xl font-semibold text-blue-600">SPY Compare</h1>
          {/* Feature Request Text */}
          <span
            onClick={handleFeatureRequestClick}
            className="hidden lg:inline-block text-blue-600 cursor-pointer hover:underline"
          >
            Request a New Feature
          </span>
        </div>
      </header>

      {/* Feature Request Modal */}
      <FeatureRequestModal isOpen={modalOpen} onClose={handleCloseModal} />

      {/* Drawer */}
      <div
        className={`fixed inset-0 z-10 bg-black bg-opacity-50 transition-opacity duration-300 ${drawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        onClick={toggleDrawer}
      ></div>
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Menu</h2>
        </div>
        <nav className="p-4 space-y-4">
          <a href="#" className="block text-gray-700 hover:text-blue-600">Home</a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">About</a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">Contact</a>
        </nav>
      </aside>

      {/* Main content (pushed down by AppBar) */}
      <main className="pt-20">
      </main>
    </div>
  );
};

export default MyAppBar;