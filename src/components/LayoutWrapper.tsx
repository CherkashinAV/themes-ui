import {Box, Stack} from '@chakra-ui/react'
import React, {PropsWithChildren} from 'react'
import Header from './Header'
import Footer from './Footer'

const LayoutWrapper = ({children}: PropsWithChildren) => {
  return (
	<Stack width='100vw' h={'100vh'} minHeight={'100vh'} gap={0} maxWidth={'100vw'}>
		<Header/>
		<Box bg='green' flex={1}>{children}</Box>
		<Footer/>
	</Stack>
  )
}

export default LayoutWrapper