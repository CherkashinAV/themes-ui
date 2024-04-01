import {AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Badge, Box, Button, Flex, Heading, Link, Stack, Tag, Text, Tooltip, transform, useDisclosure} from '@chakra-ui/react'
import React from 'react'
import {projectTypeMapping} from '../utils/themeUtils'
import {ThemeType, Theme} from '../types'
import {Link as RouterLink} from 'react-router-dom';
import {ArrowForwardIcon} from '@chakra-ui/icons';
import {useAppSelector} from '../store/hooks';
import GetThemeMentorModal from './GetThemeMentorModal';
import {DateTime, Settings} from 'luxon';

const ThemeAccordionItem = ({theme}: {theme: Theme}) => {
	const {userInfo} = useAppSelector((state) => state.user);
	const {isOpen, onOpen, onClose} = useDisclosure();

	Settings.defaultLocale = 'ru';

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
							<Stack>
								<Flex alignItems={'center'} gap={3}>
									<Text fontSize={13}>Участников</Text>
									<Badge textTransform={'none'}>{theme.executorsGroup.participants.length}/{theme.executorsGroup.size}</Badge>
								</Flex>
								<Flex gap={3} alignItems={'center'}>
									<Text fontSize={13}>Создано</Text>
									<Text fontSize={13} color={'blue.500'} textTransform={'none'}>{
										DateTime.fromISO(theme.createdAt).toLocaleString(DateTime.DATE_FULL)}
									</Text>
								</Flex>
							</Stack>
						</Flex>
						<Flex gap={3}>
							<Heading fontSize={13}>Руководитель проекта</Heading>
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
						<Flex gap={3} alignItems={'center'}>
							<Heading fontSize={13}>Прием заявок до</Heading>
							<Text fontSize={13} color={'blue.500'} textTransform={'none'}>{
								DateTime.fromISO(theme.joinDate).toLocaleString(DateTime.DATE_FULL)}
							</Text>
						</Flex>
						<Flex gap={3} alignItems={'center'}>
							<Heading fontSize={13}>Сроки реализации проекта</Heading>
							<Text fontSize={13} colorScheme={'blue'} textTransform={'none'} color={'blue.500'}>
								{DateTime.fromISO(theme.realizationDates?.from).toLocaleString(DateTime.DATE_FULL)}
							</Text>
							<Text color={'blue.500'}>-</Text>
							<Text fontSize={13} colorScheme={'blue'} textTransform={'none'} color={'blue.500'}>
								{DateTime.fromISO(theme.realizationDates?.to).toLocaleString(DateTime.DATE_FULL)}
							</Text>
						</Flex>
					</Stack>
				</Box>
				<AccordionIcon />
			</AccordionButton>
			</h2>
			<AccordionPanel pb={4} bg={'gray.50'}>
				<Stack>
					<Heading fontSize={15}>Короткое описание</Heading>
					<Text fontSize={15}>
						{theme.shortDescription}
					</Text>
					<Flex alignItems={'center'} gap={3} marginTop={5}>
						{userInfo!.uid === theme.creator.uid && !theme.approver &&
							<>
								<Button onClick={onOpen} width={'fit-content'} fontSize={12} colorScheme={'blue'} padding={2}>
									Найти руководителя
								</Button>
								<GetThemeMentorModal theme={theme} isOpen={isOpen} onClose={onClose}/>
							</>
						}
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
					</Flex>
				</Stack>
			</AccordionPanel>
		</AccordionItem>
	)
}

export default ThemeAccordionItem