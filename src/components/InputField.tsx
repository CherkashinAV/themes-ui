import React, {useState} from 'react'

interface InputFieldProps {
	type: string;
	value: string;
	onChange: React.ChangeEventHandler<HTMLInputElement>
	name: string;
	label?: string;
	placeholder?: string;
	required?: boolean;
};

const InputField = ({type, label, placeholder, required, value, onChange, name}: InputFieldProps) => {
	return (
		<div>
			{label && <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>}
			<div className="mt-2">
				<input value={value} onChange={onChange} name={name} type={type} placeholder={placeholder} required={required} autoComplete="email" className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
			</div>
		</div>
	)
}

export default InputField