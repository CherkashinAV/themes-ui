import React, {useEffect, useState} from 'react'
import InputField from '../../../components/InputField'
import Button from '../../../components/Button';
import {RootState} from '../../../store';
import {register, toggleCheckbox} from '../../../store/slices/registerForm';
import {RegisterForm} from '../../../types';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {Link, useNavigate} from 'react-router-dom';
import ErrorMessage from '../../../components/ErrorMessage';

const Register = () => {
  const [inputValue, setInputValue] = useState({
    email: '',
    password: '',
    repeatPassword: '',
    code: '',
    name: '',
    surname: '',
    patronymic: ''
  } as RegisterForm);
  const navigate = useNavigate();
  const state = useAppSelector((state: RootState)  => state.registrationForm)
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(register(inputValue))
      .then(() => navigate('/auth/login'));
  }

  const handleCheckbox= () => {
    dispatch(toggleCheckbox());
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({...inputValue, [e.target.name]: e.target.value});
  }

  return (
	  <div className='flex center min-h-full h-full flex-col justify-center px-6 py-12 lg:px-8'>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Зарегистрируйтесь</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField value={inputValue.email} onChange={handleInput} required name='email' type='email' placeholder='Email'/>
          <InputField value={inputValue.password} onChange={handleInput} required  name='password' type='password' placeholder='Пароль'/>
          <InputField value={inputValue.repeatPassword} onChange={handleInput} required name='repeatPassword' type='password' placeholder='Повторите пароль'/>
          
          <div className='flex gap-2'>
            <input type='checkbox' className='accent-indigo-600' checked={state.checkBox} onChange={handleCheckbox}></input>
            <p className='text-sm font-semibold text-indigo-600 cursor-pointer'>У меня есть код на регистрацию</p>
          </div>

          {state.checkBox ?
            <InputField value={inputValue.code} onChange={handleInput} required name='code' type='uuid' placeholder='Код приглашения'/>
            :
            <div className='flex justify-between shrink flex-wrap sm:w-full'>
              <div className='sm:w-[48%]'>
                <InputField value={inputValue.name} onChange={handleInput} type='text' name='name' required placeholder='Имя'/>
              </div>
              <div className='sm:w-[48%]'>
                <InputField value={inputValue.surname} onChange={handleInput} type='text' name='surname' required placeholder='Фамилия'/>
              </div>
              <div className='sm:w-full'>
                <InputField value={inputValue.patronymic} onChange={handleInput} type='text' name='patronymic' placeholder='Отчество'/>
              </div>
            </div>
          }
          <div>
            <Button type='submit' content='Зарегистрироваться'/>
          </div>
          
          <ErrorMessage>{state.error}</ErrorMessage>

          <div className='w-full flex items-center flex-col'>
            <p className="text-center text-sm text-gray-500">
              Уже зарегистрированы?
              <Link to='/auth/login' className="font-semibold leading-6 mx-1 text-indigo-600 hover:text-indigo-500">Войти</Link>
            </p>
          </div>
        </form>
      </div> 
    </div>
  );
}

export default Register