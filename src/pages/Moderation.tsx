import {Badge, Box, Button, Card, CardBody, CardHeader, Divider, Flex, Heading, IconButton, Input, Select, Stack, Text, VisuallyHidden, VisuallyHiddenInput, border, useDisclosure} from '@chakra-ui/react'
import Dropzone, { useDropzone } from "react-dropzone"
import React, {useEffect, useState} from 'react'
import LayoutWrapper from '../components/LayoutWrapper'
import {read, utils} from 'xlsx';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {MemberInvitationInfo} from '../types';
import {addInvitation, invite, setInvitations} from '../store/slices/RegisterInvitationsSlice';
import AddRuleModal from '../components/AddRuleModal';
import {getRules} from '../store/slices/RulesSlice';
import {getOrder} from '../store/slices/OrderSlice';
import {projectTypeMapping} from '../utils/themeUtils';
import {DownloadIcon} from '@chakra-ui/icons';

type Row = {
	name: string;
	email: string;
	role: string;
	groupName: string;
	post: string;
}

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

const Moderation = () => {
	const [curRule, setCurRule] = useState(0);
	const {invitations} = useAppSelector((state) => state.registerInvitations);
	const dispatch = useAppDispatch();
	const {isOpen, onOpen, onClose} = useDisclosure()
	const {userInfo} = useAppSelector((state) => state.user);
	const {rules} = useAppSelector((state) => state.rules);

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

	const genOrder = (id: number) => {
		dispatch(getOrder(id));
	}

	const sendInvitations = () => {
		dispatch(invite());
	}

	return (
		<LayoutWrapper>
			<Flex alignItems={'center'} justifyContent={'center'} h={'92vh'} bg={"gray.50"}>
				<Card
					rounded={"lg"}
					bg={"white"}
					height={'80%'}
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
							<Stack mt={6}>
								<Flex alignItems={'center'} gap={5}>
									<Stack alignItems={'center'} flex={0.8} width={'100%'}>
										<Flex {...getRootProps()}
											w={'100%'}
											h={'10vh'}
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
											<Button width={'fit-content'} onClick={() => addInvitations()}>Добавить</Button>
											<Button width={'fit-content'} onClick={() => setNewInvitations()}>Переписать</Button>
										</Flex>
									</Stack>
									<Card width={'100%'} alignSelf={'center'} h={'20vh'} maxHeight={'20vh'} flex={1.2}>
										<CardBody h='100%'>
											<Stack h='100%' overflowY={'scroll'} sx={scrollBarSettings}>
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
								</Flex>
							</Stack>
						</Stack>
						<Flex gap={3}>
							<Stack marginTop={10} flex={0.8} width={'100%'}>
								<Heading fontSize={15}>Добавление новых регламентов</Heading>
								<Text>Загрузите регламенты для того, чтобы руководители понимали требование к работе</Text>

								<Button onClick={onOpen}>Добавить новый регламент</Button>
								<AddRuleModal isOpen={isOpen} onClose={onClose} organizationName={userInfo!.organization.shortName}/>
							</Stack>

							<Stack marginTop={10} flex={1.2} width={'100%'}>
								<Heading fontSize={15}>Выгрузка данных по регламенту</Heading>
								<Text>Получите данные в формате excel по всем разработчикам Вашей организации, записавшихся на проект, созданный по регламенту</Text>
								<Flex gap={3}>
									<Select
										onChange={(e) => setCurRule(parseInt(e.target.value, 10))}
									>
										<option key={0} value={0}>Не выбрано</option>
										{rules.map(
											(rule) => {
												return <option key={rule.id} value={rule.id}>{rule.title}</option>
											})
										}
									</Select>
									{curRule != 0 &&
										<IconButton 
											icon={<DownloadIcon />} 
											aria-label='download-rule'
											variant={'outline'}
											onClick={() => genOrder(curRule)}
										/>
									}
								</Flex>
							</Stack>
						</Flex>

					</CardBody>
				</Card>
			</Flex>
		</LayoutWrapper>
  )
}

export default Moderation