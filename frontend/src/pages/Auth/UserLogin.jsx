import LoginForm from '../../components/Auth/LoginForm';

const UserLogin = () => {
  return (
    <div className="auth-page">
      <div className="auth-page-content">
        <h2 className='auth-header'>User Login</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default UserLogin;