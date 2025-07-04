import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../../../services/adminService';
import { FaEdit, FaTrash, FaUser, FaSearch } from 'react-icons/fa';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      const data = response.data;

      // Ensure data is an array
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        setUsers([]); // fallback to empty array
        console.warn("Unexpected user data format:", data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]); // fallback to prevent crash
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    navigate(`/admin/users/edit/${user._id}`, { 
      state: { userData: user } 
    });
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this user?');
    if (!confirm) return;

    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchLower) ||
      user.first_name.toLowerCase().includes(searchLower) ||
      user.last_name.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="user-list-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2><FaUser className="header-icon" /> User Management</h2>
        <div className="search-container-1">
          <FaSearch className="search-icon-1" />
          <input
            type="text"
            placeholder="Search by name or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-1"
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="no-users">
          <p>{users.length === 0 ? 'No users found.' : 'No matching users found.'}</p>
        </div>
      ) : (
        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Address</th>
                <th>Mobile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-username">
                      <FaUser className="user-icon" />
                      {user.username}
                    </div>
                  </td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.address}</td>
                  <td>{user.mobile}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleEdit(user)} 
                        className="edit-btn"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(user._id)} 
                        className="delete-btn"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;