import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, setPhoneNumber, setPassword, setConfirmPassword, setError } from '../../store/reducers/EditDataUsers';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const dispatch = useDispatch();
  const { phoneNumber, password, confirmPassword, loading, error, success } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordLabel, setPasswordLabel] = useState('Strength');

  const handlePhoneChange = (e) => {
    dispatch(setPhoneNumber(e.target.value));
  };

  const handlePasswordChange = (e) => {
    const inputPassword = e.target.value;
    dispatch(setPassword(inputPassword));

  
    if (inputPassword.length === 0) {
      setPasswordLabel('Strength');
      setPasswordStrength('');
    } else if (inputPassword.length <= 4) {
      setPasswordLabel('Weak');
      setPasswordStrength('weak');
    } else if (inputPassword.length <= 7) {
      setPasswordLabel('Not Bad');
      setPasswordStrength('average');
    } else {
      setPasswordLabel('Strong');
      setPasswordStrength('strong');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    dispatch(setConfirmPassword(e.target.value));
  };

  const validateForm = () => {
    if (!phoneNumber || !password || !confirmPassword) {
      dispatch(setError('Пожалуйста, заполните все поля.'));
      return false;
    }
    if (password.length < 8 || password.length > 16 || /[^a-zA-Z0-9]/.test(password)) {
      dispatch(setError('Пароль должен содержать от 8 до 16 букв и цифр, без символов.'));
      return false;
    }
    if (password !== confirmPassword) {
      dispatch(setError('Пароли не совпадают.'));
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setError('')); // Clear previous error

    if (!validateForm()) {
      return;
    }

    const userData = {
      phoneNumber,
      password,
    };

    
    dispatch(registerUser(userData));
  };

  return (
    <div className="register-form">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <InputMask
            mask="+996 (999) 999 999"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="+996 (___) ___ ___"
            required
          />
        </div>
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Введите пароль"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="eye-icon"
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        {/* Password strength gradient */}
        <div className="password-strength-container">
          <div className="strength-percent">
            <span className={passwordStrength}></span>
          </div>
          <span className="strength-label">{passwordLabel}</span>
        </div>
        <div className="password-container">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Повторите пароль"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="eye-icon"
          >
            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading ? (
          <button type="submit" disabled>
            Загружается...
          </button>
        ) : (
          <button type="submit">Зарегистрироваться</button>
        )}
        {success && <p style={{ color: 'green' }}>Регистрация успешна!</p>}
      </form>
    </div>
  );
};

export default Register;
