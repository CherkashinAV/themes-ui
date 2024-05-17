import React, {useEffect, useMemo, useRef, useState} from 'react'
import {
	Flex,
	Card,
	CardBody,
	Stack,
	Heading,
	Text,
	Input,
	Box,
	Textarea,
	Switch,
	Slider,
	SliderMark,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	Select,
	Button,
	Spinner,
	OrderedList,
	IconButton,
	ListItem
} from '@chakra-ui/react';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {TeachingMaterial, ThemeType} from '../../types';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {projectTypeMapping} from '../../utils/themeUtils';
import {updateTheme} from '../../store/slices/UpdateThemeSlice';
import LayoutWrapper from '../../components/LayoutWrapper';
import {CloseIcon, DownloadIcon} from '@chakra-ui/icons';
import {getRules} from '../../store/slices/RulesSlice';
import {clearState} from '../../store/slices/ThemeSlice';

type FormInput = {
	title: string,
	shortDescription: string,
	description: string,
	executorsCount: number,
	type: ThemeType,
	private: string,
	joinDate: string,
	realizationFrom: string;
	realizationTo: string;
	rule: string;
}

const UpdateTheme = () => {
	const {themeId} = useParams()
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const {isFetching, isSuccess, isError, errorMessage} = useAppSelector((state) => state.updateTheme);
	const {data} = useAppSelector((state) => state.theme);
	const {rules} = useAppSelector((state) => state.rules);
	const {userInfo} = useAppSelector((state) => state.user);

	const [teachingMaterials, setMaterials] = useState<TeachingMaterial[]>(data?.teachingMaterials ?? []);
	const materialTitleRef = useRef<HTMLInputElement>(null);
	const materialLinkRef = useRef<HTMLInputElement>(null);

	const addNewMaterial = () => {
		if (materialTitleRef.current && materialLinkRef.current) {
			const newMaterial: TeachingMaterial = {
				title: materialTitleRef.current.value,
				link: materialLinkRef.current.value
			} 

			if (newMaterial.link === '' || newMaterial.title === '') {
				return;
			}

			setMaterials((prev) => [
				...prev,
				newMaterial
			]);
		}
	};

	const deleteMaterial = (link: string) => {
		setMaterials((prev) => prev.filter((item) => item.link !== link));
	};

	const formControls = useForm<FormInput>({
		defaultValues: useMemo(() => {
			return {
				title: data?.title,
				shortDescription: data?.shortDescription,
				description: data?.description,
				executorsCount: data?.executorsGroup.size,
				type: data?.type,
				joinDate: data?.joinDate ?? '',
				realizationFrom: data?.realizationDates?.from ?? '',
				realizationTo: data?.realizationDates?.to ?? '',
				private: data?.private.toString(),
				rule: data?.ruleId?.toString() ?? ''
			}
		}, [data])
	});

	const currentRule = formControls.watch('rule');

	const labelStyles = {
		mt: '2',
		ml: '-2.5',
		fontSize: 'sm',
	};

	const onSubmit: SubmitHandler<FormInput> = async (formData) => {
		console.log(typeof formData.private)
		dispatch(clearState())
		dispatch(updateTheme({
			id: data!.id,
			...formData,
			teachingMaterials: teachingMaterials[0] ? teachingMaterials : null,
			private: typeof formData.private === 'boolean' ? formData.private : formData.private === 'true',
			joinDate: formData.joinDate,
			realizationDates: {
				from: formData.realizationFrom,
				to: formData.realizationTo
			},
			ruleId: formData.rule === '' ? null : parseInt(formData.rule, 10)
		}));
	};

	useEffect(() => {
		if(isSuccess) {
			navigate(`/theme/${data!.id}`);
		}
	}, [isSuccess])

	useEffect(() => {
		if (!data || data.id !== parseInt(themeId!, 10)) {
			navigate(-1);
		}
	}, [])

	useEffect(() => {
	}, [data]);

	useEffect(() => {
		dispatch(getRules());	
	}, []);

	useEffect(() => {
		if (currentRule !== '' && rules) {
			const rule = rules.find((rule) => rule.id === parseInt(currentRule, 10))!;
			formControls.setValue('joinDate', rule.joinDate);
			formControls.setValue('realizationFrom', rule.realizationDates.from);
			formControls.setValue('realizationTo', rule.realizationDates.to);
			formControls.setValue('type', rule.type);
			formControls.setValue('private', 'true');
		} else {
			formControls.resetField('joinDate');
			formControls.resetField('realizationFrom');
			formControls.resetField('realizationTo');
			formControls.resetField('type');
			formControls.resetField('private');
		}
	}, [currentRule]);

	return (
		<LayoutWrapper>
			{(data && rules) ?
				<Flex
					h={'100%'}
					align={"center"}
					justify={"center"}
					bg="gray.50"
					mt={5}
					mb={5}
				>
					<Card
						rounded={"lg"}
						bg={"white"}
						boxShadow={"lg"}
						w={"65%"}
						p={8}
					>
						<CardBody>
							<Stack>
								<Heading textAlign={'center'} marginBottom={10}>Редактирование темы</Heading>
								<form onSubmit={formControls.handleSubmit(onSubmit)}>
									<Stack spacing={5}>
										<Box>
											<Text>Название</Text>
											<Controller
												name='title'
												control={formControls.control}
												render={({field}) => (
													<Input {...field} name='title'/>
												)}
											/>
										</Box>
										<Box id="shortDescription">
											<Text>Короткое описание</Text>
											<Controller
												name='shortDescription'
												control={formControls.control}
												render={({field}) => (
													<Textarea {...field} name='shortDescription'/>
												)}
											/>
										</Box>

										<Box id="description">
											<Text>Полное описание</Text>
											<Controller
												name='description'
												control={formControls.control}
												render={({field}) => (
													<Textarea {...field} name='description'/>
												)}
											/>
										</Box>
										<Box>
											<Flex
												alignItems={'center'}
												gap={4}
											>
												Количество исполнителей
												<Box 
													padding={2}
													bg={'gray.200'}
													fontSize={12}
													borderRadius={3}
												>
													{formControls.watch().executorsCount}
												</Box>
											</Flex>
											<Controller
												name='executorsCount'
												control={formControls.control}
												render={({field}) => (
													<Slider
														{...field}
														aria-label='slider-ex-6'
														max={9}
														min={1}
														step={1}
														marginTop={10}
													>
														<SliderMark value={1} {...labelStyles}>
															1
														</SliderMark>
														<SliderMark value={5} {...labelStyles}>
															5
														</SliderMark>
														<SliderMark value={9} {...labelStyles}>
															9
														</SliderMark>
														<SliderTrack>
															<SliderFilledTrack />
														</SliderTrack>
														<SliderThumb boxSize={5}/>
													</Slider>
												)}
											/>
											
										</Box>

										<Box>
											<Text>Регламент</Text>
											<Flex gap={3} width={'100%'}>
												<Controller
													name="rule"
													control={formControls.control}
													render={({field}) => (
														<Select {...field}>
															<option value=''>Нет</option>
															{rules && rules.map(
																(rule) => {
																	return <option key={rule.id} value={rule.id}>{rule.title}</option>
																})
															}
														</Select>
													)}
												/>

												{currentRule !== '' &&
													<IconButton 
														as={Link}
														to={rules.find((rule) => rule.id === parseInt(currentRule, 10))!.downloadLink} 
														icon={<DownloadIcon />} 
														aria-label='download-rule'
														variant={'outline'}
													/>
												}
											</Flex>
										</Box>

										<Box>
											<Text>Тип работы</Text>
											<Controller
												name="type"
												control={formControls.control}
												render={({field}) => (
													<Select {...field} disabled={currentRule !== ''}>
														{Object.entries(projectTypeMapping).map(
															([key, value]) => {
																return <option key={key} value={key}>{value}</option>
															})
														}
													</Select>
												)}
											/>
											
										</Box>

										<Flex justifyContent={'space-between'}>
											<Box>
												<Text>Прием заявок до</Text>
												<Controller
													name='joinDate'
													control={formControls.control}
													render={({field}) => (
														<Input
															{...field}
															disabled={currentRule !== ''}
															width={'250px'}
															placeholder="Select Date and Time"
															size="md"
															type="date"
														/>
													)}
												/>
												
											</Box>

											<Box>
												<Text>Сроки реализации проекта</Text>
												<Flex w={'500px'} gap={3}>
													<Controller
														name='realizationFrom'
														control={formControls.control}
														render={({field}) => (
															<Input
																{...field}
																disabled={currentRule !== ''}
																placeholder="Select Date and Time"
																size="md"
																type="date"
															/>
														)}
													/>

													<Controller
														name='realizationTo'
														control={formControls.control}
														render={({field}) => (
															<Input
																{...field}
																disabled={currentRule !== ''}
																placeholder="Select Date and Time"
																size="md"
																type="date"
															/>
														)}
													/>
												</Flex>
											</Box>
										</Flex>
										<Box>
											<Controller
												name='private'
												control={formControls.control}
												render={({field}) => (
													<Switch
														{...field}
														name='private'
														defaultChecked={data!.private}
														disabled={currentRule !== '' || userInfo!.organization.id === 1}
													>
														Сделать приватной темой для вашей организации
													</Switch>
												)}
											/>
											
										</Box>

										<Box>
											<Text>Методические материаллы</Text>
											<Stack>
												<OrderedList>
													{teachingMaterials.map(({title, link}, idx) => 
														<Flex key={idx} justifyContent={'space-between'} alignItems={'center'}>
															<ListItem>
																{title} <br/> URL: {link}
															</ListItem>
															<IconButton
																size={'sm'}
																colorScheme='red'
																variant={'outline'}
																aria-label='Delete teaching material'
																icon={<CloseIcon/>}
																onClick={() => deleteMaterial(link)}
															/>
														</Flex>
													)}
												</OrderedList>
												<Flex gap={3}>
													<Input ref={materialTitleRef} placeholder='Название' name='title'/>
													<Input ref={materialLinkRef} placeholder='Ссылка' name='link'/>
													<Button width={'fit-content'} onClick={addNewMaterial}>+</Button>
												</Flex>
											</Stack>
										</Box>

										<Flex justifyContent={'center'} marginTop={6}>
											<Box width={400}>
												{isFetching ?
													<Button
														isLoading
														loadingText='Меняем данные...'
														bg={"blue.400"}
														type="submit"
														w="100%"
														color={"white"}
														disabled
													/>
													:
													<Button
													bg={"blue.400"}
													type="submit"
													w="100%"
													color={"white"}
													_hover={{
														bg: "blue.500"
													}}
													>
														Изменить
													</Button>
												}
											</Box>
										</Flex>
									</Stack>
								</form>
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
	);
}

export default UpdateTheme