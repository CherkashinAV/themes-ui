import {Box, Stack} from '@chakra-ui/react'
import React, {PropsWithChildren} from 'react'
import Header from './Header'
import Footer from './Footer'

const LayoutWrapper = ({children}: PropsWithChildren) => {
  return (
	<Stack width='100vw' height={'100vh'} gap={0}>
		<Header/>
		<Box bg='green' flex={1}>{children}</Box>
		<Footer/>
	</Stack>
  )
}

export default LayoutWrapper