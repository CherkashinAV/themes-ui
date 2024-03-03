import {Box, Card, CardBody, Flex, Heading, Spinner, Stack, Tag, Tooltip, Text, Button, Link, Badge, IconButton} from '@chakra-ui/react';
import React, {useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {checkIsJoined, checkUserRights, getTheme, joinRequest} from '../../store/slices/ThemeSlice';
import {projectTypeMapping} from '../../utils/themeUtils';
import {CheckIcon} from '@chakra-ui/icons';

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
	const {isFetching, data, isSuccess, isAlreadyJoined, isApprover} = useAppSelector((state) => state.theme);
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

	const acceptRequestHandler = () => {
		
	}

	return (isSuccess ?
		<Flex
			minH={"100vh"}
			align={"center"}
			justify={"center"}
			bg={"gray.50"}
		>
			<Card
				rounded={"lg"}
				bg={"white"}
				boxShadow={"lg"}
				w={"60%"}
				p={8}
			>
				<CardBody>
					<Stack gap={6}>
						<Flex
							justifyContent={'space-between'}
							alignItems={'center'}
						>
							<Flex
								justifyContent={'flex-start'}
								gap={5}
								alignItems={'center'}
							>
								<Heading>{data?.title}</Heading>
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
							
							<Badge justifySelf={'flex-end'} colorScheme='orange'>
								{data!.status}
							</Badge>
						</Flex>

						<Flex gap={5} alignItems={'center'}>
							<Heading fontSize={15}>Куратор проекта</Heading>
							<Badge colorScheme='purple' padding={1.5}>
								{data?.approver ?
									`${data?.approver.surname} ${data?.approver.name}`
									:
									`В активном поиске...`
								}
							</Badge>
							
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
											>
												<Link width={'100%'}>
													<CardBody>
														{`${user.surname} ${user.name}`}
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
										{data!.joinRequests.map((user) => (
											<Card
												width={'100%'}
												key={user.uid}
												rounded={"lg"}
												bg={"white"}
												boxShadow={"lg"}
											>
												<CardBody>
													<Flex alignItems={'center'} justifyContent={'space-between'}>
														<Link>
															{`${user.surname} ${user.name}`}
														</Link>
														{/* {isApprover && */}
															<IconButton 
																aria-label={'Принять запрос'}
																colorScheme='blue'
																variant={'outline'}
																fontSize={10}
																size={'sm'}
																icon={<CheckIcon/>}
																w={3}
																h={5}
																onClick={acceptRequestHandler}
															/>
														{/* } */}
													</Flex>
												</CardBody>
											</Card>
										))}
									</Stack>
								</CardBody>
							</Card>
						</Flex>
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
										onClick={joinRequestHandler}
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
			minW={"100vw"}
			minH={"100vh"}
			justifyContent={"center"}
			alignItems={"center"}
		>
			<Spinner />
		</Flex>
	)
}

export default Theme