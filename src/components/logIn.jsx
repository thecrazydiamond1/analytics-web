import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from './context/AuthProvider';
import apiClient from '../../services/apiclient';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const inputStyle = {
  width: '90%',
  padding: '10px 14px',
  fontSize: 15,
  borderRadius: 4,
  border: '1px solid #ccc',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const inputFocusStyle = {
  borderColor: '#555',
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.12)',
};

const labelStyle = {
  fontWeight: '500',
  fontSize: 14,
  color: '#333',
  display: 'block',
  marginBottom: 6,
};

const buttonPrimaryStyle = {
  width: '100%',
  padding: '12px 0',
  backgroundColor: '#1f2937', // Dark gray
  color: '#fff',
  fontWeight: '600',
  fontSize: 16,
  borderRadius: 6,
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.25s',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const buttonPrimaryHoverStyle = {
  backgroundColor: '#111827', // Darker gray on hover
};

const formContainerStyle = {
  maxWidth: 360,
  width: '100%',
  padding: 32,
  backgroundColor: '#fff',
  borderRadius: 8,
  boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
  boxSizing: 'border-box',
};

const headerStyle = {
  fontSize: 24,
  fontWeight: '700',
  color: '#111',
  marginBottom: 24,
  textAlign: 'center',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const errorTextStyle = {
  color: '#b91c1c', 
  marginBottom: 18,
  textAlign: 'center',
  fontSize: 13,
  fontWeight: '500',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const baseLayoutStyle = {
  minHeight: '100vh',
  backgroundColor: '#f9fafb', 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 16,
  boxSizing: 'border-box',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const relativeInputWrapper = {
  position: 'relative',
};

const iconButtonStyle = {
  position: 'absolute',
  right: 10,
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#666',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
};

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  handleLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label htmlFor="email" style={labelStyle}>Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
          autoComplete="email"
          onFocus={(e) => e.currentTarget.style.borderColor = inputFocusStyle.borderColor}
          onBlur={(e) => e.currentTarget.style.borderColor = inputStyle.border}
        />
      </div>

      <div>
        <label htmlFor="password" style={labelStyle}>Password</label>
        <div style={relativeInputWrapper}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // style={{ ...inputStyle, paddingRight: 36 }}
            style={inputStyle}
            required
            autoComplete="current-password"
            onFocus={(e) => e.currentTarget.style.borderColor = inputFocusStyle.borderColor}
            onBlur={(e) => e.currentTarget.style.borderColor = inputStyle.border}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={iconButtonStyle}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          ...buttonPrimaryStyle,
          ...(loading ? { cursor: 'not-allowed', opacity: 0.7 } : {}),
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = buttonPrimaryHoverStyle.backgroundColor}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = buttonPrimaryStyle.backgroundColor}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
    </>
  );
};

const OtpForm = ({ otp, setOtp, loading, handleOtpVerification }) => {
  return (
    <form onSubmit={handleOtpVerification} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label htmlFor="otp" style={labelStyle}>OTP</label>
        <input
          id="otp"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={inputStyle}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          ...buttonPrimaryStyle,
          ...(loading ? { cursor: 'not-allowed', opacity: 0.7 } : {}),
        }}
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </form>
  );
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/login', { email, password });
      if (response.status === 200) {
        setIsOtpStep(true);
        setLoading(false);
        toast.success('OTP sent to admin email');
        return;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      toast.error(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post('/verifyotp', { email, otp });
      if (response.status === 200) {
        toast.success('Admin logged in successfully');
        auth.login(response.data.accessToken);
        navigate('/maindashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
      toast.error(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={baseLayoutStyle}>
      <div style={formContainerStyle}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <img
            src="src/assets/about-cts-brief-logo.png"
            alt="CTS Logo"
            style={{ maxHeight: 60, objectFit: 'contain' }}
          />
        </div>
        <h1 style={headerStyle}>Admin Login</h1>

        {error && <div style={errorTextStyle}>{error}</div>}

        {!isOtpStep ? (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            handleLogin={handleLogin}
          />
        ) : (
          <OtpForm
            otp={otp}
            setOtp={setOtp}
            loading={loading}
            handleOtpVerification={handleOtpVerification}
          />
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
