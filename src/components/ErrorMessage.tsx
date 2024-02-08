import React, {PropsWithChildren} from 'react'

type ErrorProps = {
	errorMessage?: string;
}

const ErrorMessage = ({children}: PropsWithChildren) => {
  return (
	<>
	{children && (
		<div className='flex w-full justify-center'>
			<p className='text-sm text-red-500'>{children}</p>
		</div>
	)}
	</>
  );
}

export default ErrorMessage