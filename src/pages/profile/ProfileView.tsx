import {Card, CardBody, Flex, Heading, Stack, useColorModeValue, Text, Tag, Tooltip, Link, Spinner} from '@chakra-ui/react'
import React, {useEffect} from 'react'
import {matchRole} from '../../utils/authUtils';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {clearState, getProfile} from '../../store/slices/ProfileSlice';
import {Link as RouterLink, useParams} from 'react-router-dom';

const ProfileView = () => {
	const {uid} = useParams();
	const dispatch = useAppDispatch();
	const state = useAppSelector((state) => state.profile);

	useEffect(() => {
		dispatch(getProfile(uid!));
		return () => {dispatch(clearState())};
	}, [])

  	return (
		state.currentProfile ?
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
				w={"89%"}
				p={8}
			>
				<CardBody>
					<Stack>
						<Flex justifyContent={'center'}>
							<Heading>Профиль</Heading>
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
									{state.currentProfile!.surname + " " + state.currentProfile!.name}
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
  	);
}

export default ProfileView