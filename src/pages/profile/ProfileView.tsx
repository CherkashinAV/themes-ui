import {Card, CardBody, Flex, Heading, Stack, useColorModeValue, Text, Tag, Tooltip, Link, Spinner, Alert, AlertIcon, useDisclosure, CloseButton, Box, AlertDescription, AlertTitle, Highlight, Slide} from '@chakra-ui/react'
import React, {useEffect} from 'react'
import {matchRole} from '../../utils/authUtils';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {clearState, getProfile} from '../../store/slices/ProfileSlice';
import {Link as RouterLink, useParams} from 'react-router-dom';
import LayoutWrapper from '../../components/LayoutWrapper';
import {EditIcon} from '@chakra-ui/icons';

const ProfileView = () => {
	const {uid} = useParams();
	const dispatch = useAppDispatch();
	const state = useAppSelector((state) => state.profile);
	const {userInfo} = useAppSelector((state) => state.user);

	const {
		isOpen: isVisible,
		onClose,
		onOpen
	} = useDisclosure({ defaultIsOpen: false })

	useEffect(() => {
		dispatch(getProfile(uid!));

		return () => {dispatch(clearState())};
	}, [])

	useEffect(() => {
		if (state.currentProfile && state.currentProfile.uid === userInfo!.uid && userInfo!.description === '') {
			onOpen();
		}
	}, [state.currentProfile])

  	return (
		<LayoutWrapper>
			{state.currentProfile ?
				<Flex
					h={'100%'}
					minH={'92vh'}
					align={"center"}
					justify={"center"}
					bg={"gray.50"}
				>
					<Card
						rounded={"lg"}
						bg={"white"}
						boxShadow={"lg"}
						w={"70%"}
						h={'100%'}
						p={8}
					>
						<CardBody>
							<Stack>
								<Flex justifyContent={'space-between'} alignItems={'center'}>
									<Heading>Профиль</Heading>
									{state.currentProfile.uid === userInfo!.uid &&
										<Link
											as={RouterLink}
											color={'blue.400'}
											textDecoration={'none'}
											_hover={{color: 'blue.500'}}
											width={'fit-content'}
											to={`/profile/update`}
										>	
											<Text color={'blue.400'} _hover={{color: 'blue.500'}} fontSize={15}>Редактировать <EditIcon/></Text>
										</Link>
									}
								</Flex>
								
								<Stack spacing={2}>
									<Flex
										marginTop="2.5rem"
										alignItems={'center'}
										gap={'1rem'}
									>
										<Text
											fontSize="1.5rem"
										>
											{state.currentProfile!.surname + " " + state.currentProfile!.name + ' ' + state.currentProfile!.patronymic}
										</Text>
										<Link as={RouterLink} to="/profile">
											<Tooltip 
												label={state.currentProfile?.organization.fullName}
												hasArrow
												bg={"gray.400"}
												color={"white"}
												placement='top'
											>
												<Tag
													_hover={{transform: 'scale(1.1)'}}
												>
													{state.currentProfile?.organization.shortName}
												</Tag>
											</Tooltip>
										</Link>
									</Flex>

									<Text
										color="gray.400"
										fontSize={'1.2rem'}
									>
										{state.currentProfile!.email}
									</Text>

									<Tag
										width={'fit-content'}
									>
										{matchRole(state.currentProfile?.role)}
									</Tag>

									<Stack mt={"1.5rem"}>
										<Heading fontSize={"1.5rem"}>Обо мне</Heading>
										<Text>{state.currentProfile.description === '' ? 'Здесь пока ничего нет' : state.currentProfile.description}</Text>
									</Stack>

									<Stack mt={"1.5rem"}>
										<Heading fontSize={"1.5rem"}>Навыки</Heading>
										<Flex gap='2'>
											{state.currentProfile.skills?.length ? 
												state.currentProfile.skills.map((skill) => 
													<Tag key={skill} colorScheme='blue'>
														<Flex gap={2} alignItems={'center'}>
															<Text>{skill}</Text>
														</Flex>
													</Tag>)
												:
												<Text>Навыки пока не добавлены</Text>
											}
										</Flex>
									</Stack>
									
								</Stack>
							</Stack>
						</CardBody>
					</Card>
					<Slide in={isVisible} transition={{exit: {duration: 1}, enter: {duration: 1}}}>
						<Alert status='info' width={'fit-content'} position={'absolute'} bottom={10} right={3} borderRadius={5}>
							<AlertIcon />
							<Box>
								<AlertTitle>Внимание</AlertTitle>
								<AlertDescription>
									Чтобы пользователи понимали, кто вы такой и что умеете,<br/>
									заполните <Highlight query='"Обо мне"' styles={{fontWeight: 'bold'}}>"Обо мне"</Highlight> в разделе редактирования профиля 
								</AlertDescription>
							</Box>
							<CloseButton
								alignSelf='flex-start'
								position='relative'
								right={-1}
								top={-1}
								onClick={onClose}
							/>
						</Alert>
					</Slide>
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
  	);
}

export default ProfileView