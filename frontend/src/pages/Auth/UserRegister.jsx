import RegisterForm from '../../components/Auth/RegisterForm';
import './AuthPage.css';

const UserRegister = () => {
  return (
    <div className="auth-page">
      <div className="auth-page-content">
        <h1 className='auth-header'>User Register</h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default UserRegister;