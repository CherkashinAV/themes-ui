import {AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Badge, Box, Button, Flex, Heading, Link, Stack, Tag, Text, Tooltip, transform, useDisclosure} from '@chakra-ui/react'
import React from 'react'
import {projectTypeMapping} from '../utils/themeUtils'
import {ThemeType, Theme} from '../types'
import {Link as RouterLink} from 'react-router-dom';
import {ArrowForwardIcon} from '@chakra-ui/icons';
import {useAppSelector} from '../store/hooks';
import GetThemeMentorModal from './GetThemeMentorModal';

const ThemeAccordionItem = ({theme}: {theme: Theme}) => {
	const {userInfo} = useAppSelector((state) => state.user);
	const {isOpen, onOpen, onClose} = useDisclosure();

	return (
		<AccordionItem>
			<h2>
			<AccordionButton>
				<Box as="span" flex='1' textAlign='left'>
					<Stack>
						<Flex alignItems={'center'} justifyContent={'space-between'}>
							<Flex alignItems={'center'} gap={3}>
								<Heading fontSize={16}>{theme.title}</Heading>
								{theme!.private &&
										<Tooltip 
											label={theme!.creator.organization.shortName}
											hasArrow
											bg={"gray.400"}
											color={"white"}
											placement='top'
										>
											<Badge
												_hover={{transform: 'scale(1.1)'}}
												fontSize={12}
												textTransform={'none'}
											>
												private
											</Badge>
										</Tooltip>
									}
							</Flex>
							<Flex alignItems={'center'} gap={3}>
								<Text fontSize={13}>Участников</Text>
								<Badge textTransform={'none'}>{theme.executorsGroup.participants.length}/{theme.executorsGroup.size}</Badge>
							</Flex>
						</Flex>
						<Flex gap={3}>
							<Heading fontSize={13}>Куратор проекта</Heading>
							<Badge fontSize={12} colorScheme={'blue'} textTransform={'none'}>
								{theme.approver ?
									theme.approver.name + ' ' + theme.approver.surname :
									'Пока нет'
								}
							</Badge>
						</Flex>
						<Flex gap={3}>
							<Heading fontSize={13}>Тип работы</Heading>
							<Badge fontSize={12} colorScheme={'blue'} textTransform={'none'}>{projectTypeMapping[theme.type as ThemeType]}</Badge>
						</Flex>
						{userInfo!.uid === theme.creator.uid && !theme.approver &&
							<>
								<Button onClick={onOpen}>Найти ментора</Button>
								<GetThemeMentorModal theme={theme} isOpen={isOpen} onClose={onClose}/>
							</>
						}
					</Stack>
				</Box>
				<AccordionIcon />
			</AccordionButton>
			</h2>
			<AccordionPanel pb={4}>
				<Stack>
					<Heading fontSize={15}>Короткое описание</Heading>
					<Text fontSize={15}>
						{theme.shortDescription}
					</Text>
					<Link
						as={RouterLink}
						color={'blue.400'}
						textDecoration={'none'}
						_hover={{color: 'blue.500'}}
						width={'fit-content'}
						to={`/theme/${theme.id}/`}
						fontSize={13}
					>
						Перейти к теме <ArrowForwardIcon/>
					</Link>
				</Stack>
			</AccordionPanel>
		</AccordionItem>
	)
}

export default ThemeAccordionItem