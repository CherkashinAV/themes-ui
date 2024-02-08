import React, {useState} from 'react'
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import {SendEmailForm} from '../../../types';
import {RootState} from '../../../store';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {sendEmail, trySendAgain} from '../../../store/slices/forgotPasswordForm';
import ErrorMessage from '../../../components/ErrorMessage';
import {Link} from 'react-router-dom';

const ForgotPassword = () => {
  const [inputValue, setInputValue] = useState({
    email: '',
  } as SendEmailForm);

  const state = useAppSelector((state: RootState)  => state.forgotPasswordForm)
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(sendEmail(inputValue))
      .then();
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({...inputValue, [e.target.name]: e.target.value});
  }

  const tryAgainClickHandle = () => {
    dispatch(trySendAgain());
  }

  return (
	  <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"></h2>
      </div>

      {state.emailSent ?
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
          <p className="text-center text-sm text-gray-500">
            Письмо было отправлено на email <span className='text-indigo-600'>{inputValue.email}</span>.
            <br/>
            Перейдите по ссылке, чтобы восстановить пароль.
          </p>
          <Button onClick={tryAgainClickHandle} content='Отправить ещё раз'/>
        </div>
        :
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-center text-sm text-gray-500">
              Введите email ниже и мы отправим ссылку на восстановление пароля.
            </p>
            <InputField value={inputValue.email} onChange={handleInput} required name='email' type='email' placeholder='Email'/>
            
            <div>
              <Button type='submit' content='Отправить'/>
            </div>

            <ErrorMessage>{state.error}</ErrorMessage>

            <div className='w-full flex items-center flex-col'>
              <p className="text-center text-sm text-gray-500">
                Вспомнили пароль?
              </p>
              <Link to='/auth/login' className="text-sm font-semibold leading-6 mx-1 text-indigo-600 hover:text-indigo-500">Войти</Link>
            </div>
          </form>
        </div>
      }
    </div>
  );
}

export default ForgotPassword