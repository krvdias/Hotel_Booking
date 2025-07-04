import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box,
  Avatar,
  CircularProgress
} from '@mui/material';
import { FaCamera, FaHotel, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { addHotel } from '../../../services/adminService';

const AddHotel = () => {
  const [formData, setFormData] = useState({
    hotel_name: '',
    hotel_address: '',
    hotel_owner: '',
    hotel_image: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, hotel_image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('hotel_name', formData.hotel_name);
      formDataToSend.append('hotel_address', formData.hotel_address);
      formDataToSend.append('hotel_owner', formData.hotel_owner);
      if (formData.hotel_image) {
        formDataToSend.append('hotel_image', formData.hotel_image);
      }

      await addHotel(formDataToSend);
      navigate('/admin/hotels');
    } catch (error) {
      console.error('Error adding hotel:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          <FaHotel style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          Add New Hotel
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={previewImage}
              sx={{ 
                width: 150, 
                height: 150,
                mb: 2,
                border: '1px dashed grey'
              }}
              variant="rounded"
            >
              {!previewImage && <FaCamera size={40} />}
            </Avatar>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="hotel-image-upload"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="hotel-image-upload">
              <Button 
                variant="outlined" 
                component="span"
                startIcon={<FaCamera />}
              >
                Upload Hotel Image
              </Button>
            </label>
            {formData.hotel_image && (
              <Typography variant="caption" sx={{ mt: 1 }}>
                {formData.hotel_image.name}
              </Typography>
            )}
          </Box>

          <TextField
            fullWidth
            margin="normal"
            label={
              <span>
                <FaHotel style={{ marginRight: '8px' }} />
                Hotel Name
              </span>
            }
            name="hotel_name"
            value={formData.hotel_name}
            onChange={handleChange}
            required
            InputLabelProps={{
              style: {
                display: 'flex',
                alignItems: 'center'
              }
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label={
              <span>
                <FaMapMarkerAlt style={{ marginRight: '8px' }} />
                Hotel Address
              </span>
            }
            name="hotel_address"
            value={formData.hotel_address}
            onChange={handleChange}
            required
            InputLabelProps={{
              style: {
                display: 'flex',
                alignItems: 'center'
              }
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label={
              <span>
                <FaUser style={{ marginRight: '8px' }} />
                Hotel Owner
              </span>
            }
            name="hotel_owner"
            value={formData.hotel_owner}
            onChange={handleChange}
            required
            InputLabelProps={{
              style: {
                display: 'flex',
                alignItems: 'center'
              }
            }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ mt: 3 }}
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <FaHotel />}
          >
            {isSubmitting ? 'Adding Hotel...' : 'Add Hotel'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AddHotel;