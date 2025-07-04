import AdminLoginForm from '../../components/Auth/AdminLoginForm';

const AdminLogin = () => {
  return (
    <div className="auth-page">
      <div className="auth-page-content">
        <h2 className='auth-header'>Admin Login</h2>
        <AdminLoginForm />
      </div>
    </div>
  )
}

export default AdminLogin