import {Box, Flex, Text} from '@chakra-ui/react'
import React from 'react'

const Footer = () => {
  return (
	<Box bg={'gray.200'} width={'100%'} height={7}>
		<Flex alignItems={'center'} justifyContent={'center'}>
			<Text>Copyright © 2024 Anchi</Text>
		</Flex>
	</Box>
  )
}

export default Footer