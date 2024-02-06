import React from 'react'
import InputField from '../../../components/InputField'
import Button from '../../../components/Button';

const Register = () => {
  return (
	  <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company"/>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Зарегистрируйтесь </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST">
          <InputField type='email' placeholder='Email'/>
          <InputField type='password' placeholder='Пароль'/>
          <InputField type='password' placeholder='Повторите пароль'/>
          
          <div className='text-sm font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer'>
            Есть код на регистрацию?
          </div>
          <div>
            <Button content='Зарегистрироваться'/>
          </div>
        </form>
      </div>
      
    </div>
  );
}

export default Register