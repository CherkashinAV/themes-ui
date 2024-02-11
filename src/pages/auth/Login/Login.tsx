import React, {useState} from 'react'
import InputField from '../../../components/InputField';
import {LoginForm} from '../../../types';
import {Link, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {RootState} from '../../../store';
import Button from '../../../components/Button';
import {login} from '../../../store/slices/loginForm';
import ErrorMessage from '../../../components/ErrorMessage';
import {storeToken} from '../../../store/slices/user';

const Login = () => {
  const [inputValue, setInputValue] = useState({
    email: '',
    password: ''
  } as LoginForm);

  const navigate = useNavigate();
  const state = useAppSelector((state: RootState)  => state.loginForm)
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login(inputValue))
      .then((data) => {
        if (data.payload && typeof data.payload !== 'string') {
          dispatch(storeToken(data.payload.accessToken));
        }

        navigate('/auth/themes')
      });
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({...inputValue, [e.target.name]: e.target.value});
  }

  return (
	<div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Вход</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField value={inputValue.email} onChange={handleInput} required name='email' type='email' placeholder='Email'/>
          <InputField value={inputValue.password} onChange={handleInput} required  name='password' type='password' placeholder='Пароль'/>
          
          <div>
            <Button type='submit' content='Войти'/>
          </div>

          <ErrorMessage>{state.error}</ErrorMessage>
		  
          <div className='w-full flex items-center flex-col'>
            <p className="text-center text-sm text-gray-500">
              Нет аккаунта?
              <Link to='/auth/register' className="font-semibold leading-6 mx-1 text-indigo-600 hover:text-indigo-500">Зарегистрируйтесь</Link>
            </p>
            <p className="text-center text-sm text-gray-500">или</p>
            <div className="text-sm">
              <Link to="/auth/forgot_password" className="font-semibold text-indigo-600 hover:text-indigo-500">Забыли пароль?</Link>
            </div>
          </div>
        </form>
      </div>
      
    </div>
  );
}

export default Login