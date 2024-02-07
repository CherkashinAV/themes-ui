import React, {useState} from 'react'
import InputField from '../../../components/InputField'
import Button from '../../../components/Button';
import {RootState} from '../../../store';
import {register, toggleCheckbox} from '../../../store/slices/registerForm';
import {RegisterForm} from '../../../types';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {useNavigate} from 'react-router-dom';

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

  if (state.registered) {
    navigate('/auth/login');
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(register(inputValue))
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
        <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">
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
          <div className='flex justify-center'>
            {state.error && <p className='text-sm text-red-500 cursor-pointer'>{state.error}</p>}
          </div>
        </form>
      </div> 
    </div>
  );
}

export default Register