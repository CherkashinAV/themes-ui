import {Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Card, CardBody, Flex, Heading, Stack, useColorModeValue} from '@chakra-ui/react'
import React, {useEffect, useRef, useState} from 'react'
import {useAppDispatch, useAppSelector} from '../../store/hooks'
import ThemeAccordionItem from '../../components/ThemeAccordionItem'
import {getThemes, getThemesIds} from '../../store/slices/MyThemesSlice'
import LayoutWrapper from '../../components/LayoutWrapper'

const scrollBarSettings = {
	'&::-webkit-scrollbar': {
		width: '5px',
		borderRadius: '8px',
		backgroundColor: `rgba(0, 0, 0, 0.1)`,
	},
	'&::-webkit-scrollbar-thumb': {
		backgroundColor: `rgba(66, 153,225, 1)`,
		height:'10px'
	}
}

const MyThemes = () => {
    const dispatch = useAppDispatch();
    const {isSuccess, themes} = useAppSelector((state) => state.myThemes);
	const {userInfo} = useAppSelector((state) => state.user);

    useEffect(() => {
		dispatch(getThemesIds({userUid: userInfo!.uid}))
			.then(() => dispatch(getThemes()));
    }, []);

    return (
		<LayoutWrapper>
			{themes &&  
				<Flex alignItems={'center'} justifyContent={'center'} h={'100%'} bg={"gray.50"}>
					<Card
						rounded={"lg"}
						bg={"white"}
						width={'100%'}
						boxShadow={'md'}
						p={8}
					>
						<CardBody>
						<Flex justifyContent={'center'}>
							<Heading fontSize={20}>Список моих тем</Heading>
						</Flex>
						<Box marginTop={8} minH={'60vh'} maxH={'60vh'} overflowY={'scroll'} sx={scrollBarSettings}>
							<Accordion>
							{themes.map((theme) =>
								<ThemeAccordionItem theme={theme} key={theme.id}/>
							)}
							</Accordion>
						</Box>
						</CardBody>
					</Card>
				</Flex>
			}
		</LayoutWrapper>
    )
}

export default MyThemes