import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTable, getAllTables, updateTable, deleteTable } from "../../services/TableServices";
import Loader from "../../components/common/Loader";

const TablePage = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTable, setNewTable] = useState({
    floor: "",
    tableNumber: "",
    seatingNo: "",
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllTables();
      setTables(response.tables || []);
    } catch (err) {
      console.error("Error fetching tables:", err);
      setError(err.message || "Failed to load tables");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleAddTable = async () => {
    if (newTable.floor && newTable.tableNumber && newTable.seatingNo) {
      try {
        const tableData = {
          floor: newTable.floor,
          tableNo: parseInt(newTable.tableNumber),
          seatingCapacity: parseInt(newTable.seatingNo),
          available: true
        };
        
        await createTable(tableData);
        setNewTable({ floor: "", tableNumber: "", seatingNo: "" });
        setShowAddModal(false);
        
        // Refresh the tables list
        await fetchTables();
      } catch (err) {
        console.error("Error adding table:", err);
        alert(err.message || "Failed to add table");
      }
    }
  };

  const handleEditTable = async () => {
    if (editingTable) {
      try {
        const tableData = {
          floor: editingTable.floor,
          tableNo: parseInt(editingTable.tableNo),
          seatingCapacity: parseInt(editingTable.seatingCapacity),
          available: editingTable.available
        };
        
        await updateTable(editingTable._id, tableData);
        setEditingTable(null);
        setShowEditModal(false);
        
        // Refresh the tables list
        await fetchTables();
      } catch (err) {
        console.error("Error updating table:", err);
        alert(err.message || "Failed to update table");
      }
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (window.confirm("Are you sure you want to delete this table?")) {
      try {
        await deleteTable(tableId);
        
        // Refresh the tables list
        await fetchTables();
      } catch (err) {
        console.error("Error deleting table:", err);
        alert(err.message || "Failed to delete table");
      }
    }
  };

  const toggleFilled = async (tableId) => {
    try {
      const table = tables.find(t => t._id === tableId);
      if (table) {
        const tableData = {
          floor: table.floor,
          tableNo: parseInt(table.tableNo),
          seatingCapacity: parseInt(table.seatingCapacity),
          available: !table.available
        };
        
        await updateTable(tableId, tableData);
        
        // Refresh the tables list
        await fetchTables();
      }
    } catch (err) {
      console.error("Error toggling table status:", err);
      alert(err.message || "Failed to update table status");
    }
  };

  const filteredTables = tables.filter(
    (table) =>
      table.tableNo?.toString().includes(searchQuery.toLowerCase()) ||
      table.floor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalTables: tables.length,
    availableTables: tables.filter(t => t.available).length,
    occupiedTables: tables.filter(t => !t.available).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-yellow-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-yellow-50">
      {/* Header */}
      <header className="text-white shadow-xl" style={{ background: 'linear-gradient(to right, #437057, #2F5249, #437057)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">DineEase.com</h1>

          {/* Home and Profile Icon */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/restaurant/dashboard")}
              className="text-white transition-all duration-200 font-medium"
              style={{ color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#E8D77D'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
            >
              Dashboard
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center justify-center w-11 h-11 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold hover:bg-white/20 transition-all border-2 border-white/20"
              >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-white text-gray-800 rounded-xl shadow-2xl py-2 z-50 border border-gray-100">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-red-50 transition-all duration-200 text-red-600 font-medium rounded-lg mx-1"
                >
                  Logout
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header Section with Stats */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Table Management</h2>
              <p className="text-gray-600">Manage your restaurant tables and seating arrangements</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search tables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-72 px-5 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none transition-all duration-200 shadow-sm"
                style={{ borderColor: '#e5e7eb' }}
                onFocus={(e) => { e.target.style.borderColor = '#437057'; e.target.style.boxShadow = '0 0 0 3px rgba(67, 112, 87, 0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 absolute left-4 top-3.5 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Tables</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalTables}</p>
                </div>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(67, 112, 87, 0.1)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7" style={{ color: '#437057' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Available</p>
                  <p className="text-3xl font-bold text-green-600">{stats.availableTables}</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Occupied</p>
                  <p className="text-3xl font-bold text-red-600">{stats.occupiedTables}</p>
                </div>
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-red-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Table Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-8 py-3 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            style={{ backgroundColor: '#437057' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2F5249'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#437057'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Table
          </button>
        </div>

        {/* Tables Grid */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-white" style={{ background: 'linear-gradient(to right, #437057, #2F5249)' }}>
                  <th className="px-6 py-4 text-left font-bold text-sm uppercase tracking-wider">
                    Floor
                  </th>
                  <th className="px-6 py-4 text-left font-bold text-sm uppercase tracking-wider">
                    Table Number
                  </th>
                  <th className="px-6 py-4 text-left font-bold text-sm uppercase tracking-wider">
                    Seating Capacity
                  </th>
                  <th className="px-6 py-4 text-left font-bold text-sm uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-bold text-sm uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTables.map((table, index) => (
                  <tr key={table._id} className="transition-all duration-150" style={{ backgroundColor: 'white' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(151, 176, 103, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                    <td className="px-6 py-4 text-gray-900 font-medium">{table.floor}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: 'rgba(67, 112, 87, 0.1)', color: '#437057' }}>
                        {table.tableNo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-medium">{table.seatingCapacity} seats</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleFilled(table._id)}
                          className={`px-4 py-1.5 rounded-lg text-white font-semibold text-sm transition-all duration-200 shadow-sm ${
                            !table.available 
                              ? "bg-red-600 hover:bg-red-700 shadow-red-200" 
                              : "bg-gray-400 hover:bg-grey-600"
                          }`}
                        >
                          Occupied
                        </button>
                        <button
                          onClick={() => toggleFilled(table._id)}
                          className={`px-4 py-1.5 rounded-lg text-white font-semibold text-sm transition-all duration-200 shadow-sm ${
                            table.available 
                              ? "bg-green-600 hover:bg-green-700 shadow-green-200" 
                              : "bg-gray-300 hover:bg-gray-400"
                          }`}
                        >
                          Available
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingTable(table);
                            setShowEditModal(true);
                          }}
                          className="px-5 py-2 text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
                          style={{ backgroundColor: '#437057' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2F5249'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#437057'}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTable(table._id)}
                          className="px-5 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTables.length === 0 && (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-400 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              <p className="text-gray-500 text-lg">No tables found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or add a new table</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(67, 112, 87, 0.1)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" style={{ color: '#437057' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Add New Table</h3>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Floor</label>
                <input
                  type="text"
                  value={newTable.floor}
                  onChange={(e) =>
                    setNewTable({ ...newTable, floor: e.target.value })
                  }
                  placeholder="e.g., Ground, First Floor, Second Floor"
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 shadow-sm"
                  style={{ borderColor: '#e5e7eb' }}
                  onFocus={(e) => { e.target.style.borderColor = '#437057'; e.target.style.boxShadow = '0 0 0 3px rgba(67, 112, 87, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Table Number
                </label>
                <input
                  type="number"
                  value={newTable.tableNumber}
                  onChange={(e) =>
                    setNewTable({ ...newTable, tableNumber: e.target.value })
                  }
                  placeholder="e.g., 101, 102, 103"
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 shadow-sm"
                  style={{ borderColor: '#e5e7eb' }}
                  onFocus={(e) => { e.target.style.borderColor = '#437057'; e.target.style.boxShadow = '0 0 0 3px rgba(67, 112, 87, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Seating Capacity
                </label>
                <input
                  type="number"
                  value={newTable.seatingNo}
                  onChange={(e) =>
                    setNewTable({ ...newTable, seatingNo: e.target.value })
                  }
                  placeholder="e.g., 4, 6, 8"
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 shadow-sm"
                  style={{ borderColor: '#e5e7eb' }}
                  onFocus={(e) => { e.target.style.borderColor = '#437057'; e.target.style.boxShadow = '0 0 0 3px rgba(67, 112, 87, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleAddTable}
                className="flex-1 px-6 py-3 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                style={{ background: 'linear-gradient(to right, #437057, #2F5249)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #2F5249, #1a2e28)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #437057, #2F5249)'}
              >
                Add Table
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewTable({ floor: "", tableNumber: "", seatingNo: "" });
                }}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {showEditModal && editingTable && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(67, 112, 87, 0.1)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" style={{ color: '#437057' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Edit Table</h3>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Floor</label>
                <input
                  type="text"
                  value={editingTable.floor}
                  onChange={(e) =>
                    setEditingTable({ ...editingTable, floor: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 shadow-sm"
                  style={{ borderColor: '#e5e7eb' }}
                  onFocus={(e) => { e.target.style.borderColor = '#437057'; e.target.style.boxShadow = '0 0 0 3px rgba(67, 112, 87, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Table Number
                </label>
                <input
                  type="number"
                  value={editingTable.tableNo}
                  onChange={(e) =>
                    setEditingTable({ ...editingTable, tableNo: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 shadow-sm"
                  style={{ borderColor: '#e5e7eb' }}
                  onFocus={(e) => { e.target.style.borderColor = '#437057'; e.target.style.boxShadow = '0 0 0 3px rgba(67, 112, 87, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Seating Capacity
                </label>
                <input
                  type="number"
                  value={editingTable.seatingCapacity}
                  onChange={(e) =>
                    setEditingTable({
                      ...editingTable,
                      seatingCapacity: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 shadow-sm"
                  style={{ borderColor: '#e5e7eb' }}
                  onFocus={(e) => { e.target.style.borderColor = '#437057'; e.target.style.boxShadow = '0 0 0 3px rgba(67, 112, 87, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleEditTable}
                className="flex-1 px-6 py-3 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                style={{ background: 'linear-gradient(to right, #437057, #2F5249)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #2F5249, #1a2e28)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #437057, #2F5249)'}
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTable(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablePage;
