import api from './Api';

// =================== TABLE MANAGEMENT SERVICES (Restaurant) =================== //

/**
 * Create a new table (Restaurant side)
 * @param {Object} tableData - { floorNo, tableNo, seatingCapacity, available }
 * @returns {Promise} Created table data
 */
export const createTable = async (tableData) => {
  try {
    const response = await api.post('/tables/add', tableData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create table' };
  }
};

/**
 * Get all tables for logged-in restaurant
 * @returns {Promise} Array of tables
 */
export const getAllTables = async () => {
  try {
    const response = await api.get('/tables/all');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch tables' };
  }
};

/**
 * Update a table (Restaurant side)
 * @param {string} tableId - Table ID
 * @param {Object} tableData - Updated table data
 * @returns {Promise} Updated table data
 */
export const updateTable = async (tableId, tableData) => {
  try {
    const response = await api.put(`/tables/${tableId}`, tableData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update table' };
  }
};

/**
 * Delete a table (Restaurant side)
 * @param {string} tableId - Table ID
 * @returns {Promise} Deletion confirmation
 */
export const deleteTable = async (tableId) => {
  try {
    const response = await api.delete(`/tables/${tableId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete table' };
  }
};

/**
 * Get tables by restaurant ID (PUBLIC - for users to see available tables)
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise} Array of tables for the restaurant
 */
export const getTablesByRestaurant = async (restaurantId) => {
  try {
    const response = await api.get(`/tables/restaurant/${restaurantId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch restaurant tables' };
  }
};

// =================== DEFAULT EXPORT =================== //

const TableServices = {
  createTable,
  getAllTables,
  updateTable,
  deleteTable,
  getTablesByRestaurant,
};

export default TableServices;
