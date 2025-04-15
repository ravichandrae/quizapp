import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Fetch users from the API when component mounts
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/users');
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the API data to match our component's expected format
      // Adding placeholder values for fields not in the API response
      const transformedData = data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role || 'Student', // Default role if not provided by API
        status: user.status || 'Active', // Default status if not provided by API
        school: user.school || 'N/A',
        pin: user.pin || 'N/A'
      }));
      
      setUsers(transformedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
      // Fall back to sample data if API fails
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', mobile: '1234567890', role: 'Student', status: 'Active', school: 'N/A', pin: 'N/A' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', mobile: '9876543210', role: 'Student', status: 'Active', school: 'N/A', pin: 'N/A' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>Manage Users</h2>
      </div>
      
      <div className="search-filter">
        <input 
          type="text" 
          placeholder="Search users..." 
          className="search-input" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="filter-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      
      {loading ? (
        <div className="loading-indicator">Loading users...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="table-container">
            <table className="data-table users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>School</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.mobile}</td>
                      <td>{user.school}</td>
                      <td>{user.role}</td>
                      <td>
                        <span className={`status-badge ${user.status.toLowerCase()}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button className="icon-button view">View</button>
                        <button className="icon-button edit">Edit</button>
                        <button className="icon-button delete">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">No users found matching your criteria</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="pagination">
            <button className="pagination-button">Previous</button>
            <span className="pagination-info">Page 1 of 1</span>
            <button className="pagination-button">Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersManagement; 