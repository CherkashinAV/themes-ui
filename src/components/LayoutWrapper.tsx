import {Box, Stack, useColorModeValue} from '@chakra-ui/react'
import React, {PropsWithChildren} from 'react'
import Header from './Header'
import Footer from './Footer'

const LayoutWrapper = ({children}: PropsWithChildren) => {
  return (
	<Stack width='100vw' minHeight={'100vh'} gap={0} >
		<Header/>
		<Box flex={1} bg={useColorModeValue("gray.50", "gray.800")}>{children}</Box>
		<Footer/>
	</Stack>
  )
}

export default LayoutWrapper