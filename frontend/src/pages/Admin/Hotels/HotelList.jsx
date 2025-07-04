import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHotels, deleteHotel } from '../../../services/adminService';
import { FaEdit, FaTrash, FaEye, FaHotel, FaMapMarkerAlt, FaUser, FaSearch } from 'react-icons/fa';
import './HotelList.css';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    // Filter hotels whenever searchTerm or hotels change
    const filtered = hotels.filter(hotel => {
      const searchLower = searchTerm.toLowerCase();
      return (
        hotel.hotel_name.toLowerCase().includes(searchLower) ||
        hotel.hotel_address.toLowerCase().includes(searchLower)
      );
    });
    setFilteredHotels(filtered);
  }, [searchTerm, hotels]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await getHotels();
      const data = response.data;

      // Ensure data is an array
      if (Array.isArray(data)) {
        setHotels(data);
        setFilteredHotels(data);
      } else if (Array.isArray(data.hotels)) {
        setHotels(data.hotels);
        setFilteredHotels(data.hotels);
      } else {
        setHotels([]); // fallback to empty array
        setFilteredHotels([]);
        console.warn("Unexpected hotel data format:", data);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setHotels([]); // fallback to prevent crash
      setFilteredHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hotel) => {
    navigate(`/admin/hotels/edit/${hotel._id}`, { 
      state: { hotelData: hotel } 
    });
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this hotel?');
    if (!confirm) return;

    try {
      await deleteHotel(id);
      fetchHotels();
    } catch (error) {
      console.error('Error deleting hotel:', error);
    }
  };

  const handleViewRooms = (id) => {
    navigate(`/admin/hotels/${id}/rooms`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="hotel-list-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="hotel-list-container">
      <div className="hotel-list-header">
        <h2><FaHotel className="header-icon" /> Hotel Management</h2>
        <div className="header-controls">
          <div className="search-container-2">
            <FaSearch className="search-icon-2" />
            <input
              type="text"
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input-2"
            />
          </div>
          <button 
            className="add-hotel-btn"
            onClick={() => navigate('/admin/hotels/add')}
          >
            Add New Hotel
          </button>
        </div>
      </div>

      {filteredHotels.length === 0 ? (
        <div className="no-hotels">
          <p>
            {hotels.length === 0 
              ? 'No hotels found. Add a new hotel to get started.' 
              : 'No matching hotels found.'}
          </p>
        </div>
      ) : (
        <div className="hotel-table-container">
          <table className="hotel-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Owner</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHotels.map((hotel) => (
                <tr key={hotel._id}>
                  <td>
                    <div className="hotel-name-1">
                      <FaHotel className="hotel-icon" />
                      {hotel.hotel_name}
                    </div>
                  </td>
                  <td>
                    <div className="hotel-address">
                      <FaMapMarkerAlt className="address-icon" />
                      {hotel.hotel_address}
                    </div>
                  </td>
                  <td>
                    <div className="hotel-owner">
                      <FaUser className="owner-icon" />
                      {hotel.hotel_owner}
                    </div>
                  </td>
                  <td>
                    {hotel.hotel_image ? (
                      <img 
                        src={hotel.hotel_image} 
                        alt={hotel.hotel_name} 
                        className="hotel-image"
                      />
                    ) : (
                      <div className="image-placeholder">No Image</div>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleViewRooms(hotel._id)} 
                        className="view-btn"
                        title="View Rooms"
                      >
                        <FaEye />
                      </button>
                      <button 
                        onClick={() => handleEdit(hotel)} 
                        className="edit-btn"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(hotel._id)} 
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

export default HotelList;