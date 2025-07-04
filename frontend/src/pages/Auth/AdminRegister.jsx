import AdminRegisterForm from '../../components/Auth/AdminRegisterForm';
import './AuthPage.css';

const AdminRegister = () => {
  return (
    <div className="auth-page">
      <div className="auth-page-content">
        <h1 className='auth-header'>Admin Register</h1>
        <AdminRegisterForm />
      </div>
    </div>
  );
};

export default AdminRegister;