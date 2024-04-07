import {Badge, Box, Button, Card, CardBody, CardHeader, Divider, Flex, Heading, Input, Stack, Text, VisuallyHidden, VisuallyHiddenInput, useDisclosure} from '@chakra-ui/react'
import Dropzone, { useDropzone } from "react-dropzone"
import React, {useEffect} from 'react'
import LayoutWrapper from '../components/LayoutWrapper'
import {read, utils} from 'xlsx';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {MemberInvitationInfo} from '../types';
import {addInvitation, invite, setInvitations} from '../store/slices/RegisterInvitationsSlice';
import AddRuleModal from '../components/AddRuleModal';
import {getRules} from '../store/slices/RulesSlice';

type Row = {
	name: string;
	email: string;
	role: string;
}

const Moderation = () => {
	const {invitations} = useAppSelector((state) => state.registerInvitations);
	const dispatch = useAppDispatch();
	const {isOpen, onOpen, onClose} = useDisclosure()
	const {userInfo} = useAppSelector((state) => state.user);

	const {
		getRootProps,
		getInputProps,
		isFocused,
		isDragAccept,
		isDragReject,
		acceptedFiles
	} = useDropzone({
		accept: {
			'application/vnd.ms-excel': ['.xls'],
	 		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
		}
	});

	useEffect(() => {
		dispatch(getRules());
	}, []);

	const getColor = () => {
		if (isDragAccept) {
			return '#00e676';
		}
		if (isDragReject) {
			return '#ff1744';
		}
		if (isFocused) {
			return '#2196f3';
		}
		return '#eeeeee';
	}

	const setNewInvitations = () => {
		(async () => {
			if (acceptedFiles[0]) {
				const arrayBuffer = await acceptedFiles[0].arrayBuffer();
				const wb = read(arrayBuffer);
				const ws = wb.Sheets[wb.SheetNames[0]];
				const data: MemberInvitationInfo[] = utils.sheet_to_json<Row>(ws).map((row) => (
					{...row, status: 'NOT_SENT'} as MemberInvitationInfo
				));

				dispatch(setInvitations(data));
			}
		})()
	}

	const addInvitations = () => {
		(async () => {
			if (acceptedFiles[0]) {
				const arrayBuffer = await acceptedFiles[0].arrayBuffer();
				const wb = read(arrayBuffer);
				const ws = wb.Sheets[wb.SheetNames[0]];
				utils.sheet_to_json<Row>(ws).forEach((row) => {
					const invitation = {...row, status: 'NOT_SENT'} as MemberInvitationInfo

					dispatch(addInvitation(invitation));
				});

			}
		})()
	}

	const sendInvitations = () => {
		dispatch(invite());
	}

	return (
		<LayoutWrapper>
			<Flex alignItems={'center'} justifyContent={'center'} h={'100%'} bg={"gray.50"}>
				<Card
					rounded={"lg"}
					bg={"white"}
					width={'100%'}
					boxShadow={'md'}
					w={'80%'}
					p={8}
				>
					<CardBody>
						<Flex justifyContent={'center'} marginBottom={8}>
							<Heading fontSize={20}>Панель администрации</Heading>
						</Flex>

						<Stack>
							<Heading fontSize={15}>Приглашения пользователей</Heading>
							<Text>Загрузите информацию о пользователях, которых хотите пригласить в организацию</Text>

							<Stack>
								<Stack alignItems={'center'}>
									<Flex {...getRootProps()}
										w={'60%'}
										h={'150px'}
										justifyContent={'center'}
										alignItems={'center'}
										border={'2px dashed'}
										borderColor={getColor()}
										borderRadius={10}
									>
										{acceptedFiles[0] ?
											<Stack alignItems={'center'}>
												<Text>{acceptedFiles[0].name}</Text>
												<Text textAlign={'center'}>Можно добавить еще один файл,<br/>перетащив его или кликнув по области</Text>
											</Stack>
											:
											<>
												<input {...getInputProps()}/>
												<Text>Загрузите xmls файл для рассылки приглашений</Text>
											</>
										}
									</Flex>

									<Flex gap={3}>
										<Button width={'fit-content'} onClick={() => addInvitations()}>Дописать</Button>
										<Button width={'fit-content'} onClick={() => setNewInvitations()}>Переписать</Button>
									</Flex>
								</Stack>
								<Card width={'60%'} alignSelf={'center'} h={'20vh'} maxHeight={'20vh'}>
									<CardBody h='100%'>
										<Stack h='100%' overflowY={'scroll'}>
											{invitations.map((invitation, idx) => 
												<Box key={idx}>
													<Flex alignItems={'center'} justifyContent={'space-between'}>
														<Stack>
															<Text>{invitation.name} ({invitation.email})</Text>
															<Text>{invitation.role}</Text>
														</Stack>

														<Badge height={'fit-content'}>{invitation.status}</Badge>
													</Flex>

													<Divider/>
												</Box>
											)}
										</Stack>
									</CardBody>
									<Flex w='100%' position={'absolute'} bottom={-5} justifyContent={'center'}>
										<Button width={'fit-content'} onClick={() => sendInvitations()}>Отослать приглашения</Button>
									</Flex>
								</Card>
							</Stack>
						</Stack>

						<Stack>
							<Heading fontSize={15}>Добавление новых регламентов</Heading>
							<Text>Загрузите регламенты для того, чтобы руководители понимали требование к работе</Text>

							<Button onClick={onOpen}>Добавить новый регламент</Button>
							<AddRuleModal isOpen={isOpen} onClose={onClose} organizationName={userInfo!.organization.shortName}/>
						</Stack>
					</CardBody>
				</Card>
			</Flex>
		</LayoutWrapper>
  )
}

export default Moderation