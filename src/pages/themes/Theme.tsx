import {Box, Card, CardBody, Flex, Heading, Spinner, Stack, Tag, Tooltip, Text, Button, Link, Badge, IconButton, OrderedList, ListItem} from '@chakra-ui/react';
import React, {useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {acceptRequest, checkIsJoined, checkUserRights, deleteRequest, getTheme, joinRequest} from '../../store/slices/ThemeSlice';
import {projectTypeMapping} from '../../utils/themeUtils';
import {CheckIcon, EditIcon} from '@chakra-ui/icons';
import {Link as RouterLink} from 'react-router-dom';
import LayoutWrapper from '../../components/LayoutWrapper';

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

const Theme = () => {
	const themeId = useParams().themeId!;
	const dispatch = useAppDispatch();
	const {isFetching, data, isSuccess, isAlreadyJoined, isApprover, isCreator} = useAppSelector((state) => state.theme);
	const {userInfo} = useAppSelector((state) => state.user)

	useEffect(() => {
		dispatch(getTheme(themeId));
	}, []);

	useEffect(() => {
		if (data) {
			dispatch(checkIsJoined(userInfo!.uid));
			dispatch(checkUserRights(userInfo!.uid));
		}
	}, [data])

	const joinRequestHandler = () => {
		dispatch(joinRequest(parseInt(themeId, 10)));
	}

	const acceptRequestHandler = (userUid: string) => {
		dispatch(acceptRequest({groupId: data!.executorsGroup.id, userUid}))
	}

	const deleteRequestHandler = () => {
		dispatch(deleteRequest({groupId: data!.executorsGroup.id, userUid: userInfo!.uid}))
	}

	return (
		<LayoutWrapper>
			{isSuccess ?
				<Flex
					h={'92vh'}
					align={"center"}
					justify={"center"}
					bg={"gray.50"}
				>
					<Card
						rounded={"lg"}
						bg={"white"}
						boxShadow={"lg"}
						w={"80%"}
						p={8}
						mt={5}
						mb={5}
					>
						<CardBody>
							<Stack gap={6}>
								<Flex
									justifyContent={'space-between'}
									alignItems={'center'}
								>
									<Heading>{data?.title}</Heading>

									<Badge justifySelf={'flex-end'} colorScheme='orange'>
										{data!.status}
									</Badge>
								</Flex>
								<Flex
									justifyContent={'flex-start'}
									gap={5}
									alignItems={'center'}
								>
									{data!.private &&
										<Tooltip 
											label={data!.creator.organization.shortName}
											hasArrow
											bg={"gray.400"}
											color={"white"}
											placement='top'
										>
											<Tag
												_hover={{transform: 'scale(1.1)'}}
												width={'fit-content'}
												height={'fit-content'}
											>
												private
											</Tag>
										</Tooltip>
									}
									<Tag width={'fit-content'}>
										{projectTypeMapping[data!.type]}
									</Tag>
								</Flex>
								<Flex justifyContent={'space-between'}>
									<Flex gap={5} alignItems={'center'}>
										<Heading fontSize={15}>Руководитель проекта</Heading>
										{data?.approver ?
											<Link as={RouterLink} to={`/profile/${data.approver.uid}`}>
												<Badge colorScheme='blue' padding={1.5}>
													{data.approver.surname} {data.approver.name} {data.approver?.patronymic ?? ''}
												</Badge>
											</Link>
											:
											<Badge colorScheme='purple' padding={1.5}>
												В активном поиске
											</Badge>
										}
										
									</Flex>
									
									{(data?.approver ? isApprover : isCreator) &&
										<Link
											as={RouterLink}
											color={'blue.400'}
											textDecoration={'none'}
											_hover={{color: 'blue.500'}}
											width={'fit-content'}
											to={`/theme/${data!.id}/update`}
										>	
											<Text color={'blue.400'} _hover={{color: 'blue.500'}} fontSize={15}>Редактировать <EditIcon/></Text>
										</Link>
									}
								</Flex>

								<Stack marginTop={5} gap={5}>
									<Heading as='h2' fontSize={25}>Над чем предстоит работать</Heading>
									<Text>{data!.description}</Text>
								</Stack>
							
								<Flex
									justifyContent={'center'}
									gap={6}
									width={'100%'}
									marginTop={10}
								>
									<Card
										width={'100%'}
										rounded={"lg"}
										bg={"white"}
										boxShadow={"lg"}
									>
										<CardBody>
											<Flex justifyContent={'center'}>
												<Heading fontSize={15}>Участники проекта</Heading>
												</Flex>
											<Stack
												alignItems={'center'}
												width={'100%'}
												gap={5}
												maxHeight={300} 
												overflowY={'scroll'}
												marginTop={10}
												sx={scrollBarSettings}
											>
												{data!.executorsGroup.participants.map((user) => (
													<Card
														width={'100%'}
														rounded={"lg"}
														bg={"white"}
														boxShadow={"lg"}
														key={user.uid}
													>
														<Link width={'100%'}>
															<CardBody>
																{`${user.surname} ${user.name} ${user.patronymic ?? ''}`}
															</CardBody>
														</Link>
													</Card>
												))}
											</Stack>
										</CardBody>
									</Card>
									<Card
										width={'100%'}
										rounded={"lg"}
										bg={"white"}
										boxShadow={"lg"}
									>
										<CardBody>
											<Flex justifyContent={'center'}>
												<Heading fontSize={15}>Заявки на участие</Heading>
											</Flex>
											<Stack
												alignItems={'center'}
												width={'100%'}
												gap={5}
												maxHeight={300} 
												overflowY={'scroll'}
												marginTop={10}
												sx={scrollBarSettings}
											>
												{data!.joinRequests.map(({user}) => (
													<Card
														width={'100%'}
														key={user.uid}
														rounded={"lg"}
														bg={"white"}
														boxShadow={"lg"}
													>
														<CardBody>
															<Flex alignItems={'center'} justifyContent={'space-between'}>
																<Link as={RouterLink} to={`/profile/${user.uid}`}>
																	{`${user.surname} ${user.name} ${user.patronymic ?? ''}`}
																</Link>
																{isApprover &&
																	<IconButton 
																		aria-label={'Принять запрос'}
																		colorScheme='blue'
																		variant={'outline'}
																		fontSize={10}
																		size={'sm'}
																		icon={<CheckIcon/>}
																		w={3}
																		h={5}
																		onClick={() => acceptRequestHandler(user.uid)}
																	/>
																} 
															</Flex>
														</CardBody>
													</Card>
												))}
											</Stack>
										</CardBody>
									</Card>
								</Flex>

								<Box>
									{data!.teachingMaterials &&
										<>
										<Heading fontSize={15}>Методические материаллы</Heading>
										<OrderedList mt={'5'}>
											{data!.teachingMaterials.map((item) => 
												<ListItem>
													{item.title} <br/>
													<Link>{item.link}</Link>
												</ListItem>
											)}
										</OrderedList>
										</>
									}
								</Box>

								<Stack alignItems={'center'}>
									{isAlreadyJoined ?
										(isFetching ?
											<Button
												isLoading
												loadingText='Отзываем...'
												bg={"red.400"}
												type="submit"
												width={'fit-content'}
												color={"white"}
												_hover={{
													bg: "red.500"
												}}
											/>
											:
											<Button
												bg={"red.400"}
												type="submit"
												w="100%"
												color={"white"}
												fontSize={12}
												width={'fit-content'}
												_hover={{
													bg: "red.500"
												}}
												onClick={() => deleteRequestHandler()}
											>
												Отозвать заявку
											</Button>
										)
										:
										(isFetching ?
											<Button
												isLoading
												loadingText='Передаем запрос...'
												bg={"blue.400"}
												type="submit"
												width={'fit-content'}
												color={"white"}
												_hover={{
													bg: "blue.500"
												}}
											/>
											:
											<Button
												bg={"blue.400"}
												type="submit"
												w="100%"
												color={"white"}
												fontSize={12}
												width={'fit-content'}
												_hover={{
													bg: "blue.500"
												}}
												onClick={joinRequestHandler}
											>
												Подать заявку
											</Button>
										)
									}
								</Stack>
							</Stack>
						</CardBody>
					</Card>
				</Flex>
				:
				<Flex
					h={'100%'}
					w={'100%'}
					justifyContent={"center"}
					alignItems={"center"}
				>
					<Spinner />
				</Flex>
			}
		</LayoutWrapper>
	)
}

export default Theme