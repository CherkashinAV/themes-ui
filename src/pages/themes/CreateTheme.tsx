import React, {useEffect, useRef, useState} from 'react'
import {
	Flex,
	Card,
	useColorModeValue,
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
	OrderedList,
	ListItem,
	IconButton
} from '@chakra-ui/react';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {TeachingMaterial, ThemeType} from '../../types';
import {clearState, createTheme} from '../../store/slices/CreateThemeSlice';
import {useNavigate} from 'react-router-dom';
import {projectTypeMapping} from '../../utils/themeUtils';
import LayoutWrapper from '../../components/LayoutWrapper';
import {CloseIcon} from '@chakra-ui/icons';

type FormInput = {
	title: string,
	shortDescription: string,
	description: string,
	executorsCount: number,
	type: ThemeType,
	joinDate: string,
	realizationFrom: string,
	realizationTo: string,
	private: string
}

const CreateTheme = () => {
	const navigate = useNavigate();
	const {control, watch, handleSubmit} = useForm<FormInput>({
		defaultValues: {
			title: '',
			shortDescription: '',
			description: '',
			executorsCount: 1,
			joinDate: '',
			realizationFrom: '',
			realizationTo: '',
			type: 'course',
			private: 'false'
		}
	});
	const dispatch = useAppDispatch();
	const {isFetching, isSuccess, themeId, isError, errorMessage} = useAppSelector((state) => state.createTheme);

	const [teachingMaterials, setMaterials] = useState<TeachingMaterial[]>([]);
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
	}

	const labelStyles = {
		mt: '2',
		ml: '-2.5',
		fontSize: 'sm',
	};

	const onSubmit: SubmitHandler<FormInput> = async (data) => {
		dispatch(createTheme({
			...data,
			private: data.private === 'true',
			teachingMaterials: teachingMaterials[0] ? teachingMaterials : null,
			joinDate: data.joinDate,
			realizationDates: {
				from: data.realizationFrom,
				to: data.realizationTo
			}
		}));
	};

	useEffect(() => {
		if(isSuccess) {
			dispatch(clearState());
			navigate(`/theme/${themeId}`);
		}
	}, [isSuccess])

	return (
		<LayoutWrapper>
			<Flex
				align={"center"}
				justify={"center"}
				bg={useColorModeValue("gray.50", "gray.800")}
				height={'100%'}
			>
				<Card
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					marginTop={10}
					marginBottom={10}
					w={"60%"}
					p={8}
				>
					<CardBody>
						<Stack>
							<Heading textAlign={'center'} marginBottom={10}>Добавить новую тему</Heading>
							<form onSubmit={handleSubmit(onSubmit)}>
								<Stack spacing={8}>
									<Box>
										<Text>Название</Text>
										<Controller
											name='title'
											control={control}
											render={({field}) => (
												<Input {...field} name='title'/>
											)}
										/>
									</Box>
									<Box id="shortDescription">
										<Text>Короткое описание</Text>
										<Controller
											name='shortDescription'
											control={control}
											render={({field}) => (
												<Textarea {...field} name='shortDescription'/>
											)}
										/>
									</Box>

									<Box id="description">
										<Text>Полное описание</Text>
										<Controller
											name='description'
											control={control}
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
												{watch().executorsCount}
											</Box>
										</Flex>
										<Controller
											name='executorsCount'
											control={control}
											render={({field}) => (
												<Slider
													{...field}
													aria-label='slider-ex-6'
													defaultValue={1}
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
										<Text>Тип работы</Text>
										<Controller
											name="type"
											control={control}
											render={({field}) => (
												<Select {...field}>
													{Object.entries(projectTypeMapping).map(
														([key, value]) => {
															return <option key={key} value={key}>{value}</option>
														})
													}
												</Select>
											)}
										/>
										
									</Box>

									<Box>
										<Text>Прием заявок до</Text>
										<Controller
											name='joinDate'
											control={control}
											render={({field}) => (
												<Input
													{...field}
													width={'200px'}
													placeholder="Select Date and Time"
													size="md"
													type="date"
												/>
											)}
										/>
										
									</Box>

									<Box>
										<Text>Сроки реализации проекта</Text>
										<Stack w={'200px'}>
											<Controller
												name='realizationFrom'
												control={control}
												render={({field}) => (
													<Input
														{...field}
														placeholder="Select Date and Time"
														size="md"
														type="date"
													/>
												)}
											/>

											<Controller
												name='realizationTo'
												control={control}
												render={({field}) => (
													<Input
														{...field}
														placeholder="Select Date and Time"
														size="md"
														type="date"
													/>
												)}
											/>
										</Stack>
									</Box>

									<Box>
										<Controller
											name='private'
											control={control}
											render={({field}) => (
												<Switch {...field} name='private'>
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
											<Input ref={materialTitleRef} name='title'/>
											<Input ref={materialLinkRef} name='link'/>
											<Button width={'fit-content'} onClick={addNewMaterial}>Добавить</Button>
										</Stack>
									</Box>

									<Flex justifyContent={'center'} marginTop={6}>
										<Box width={400}>
											{isFetching ?
												<Button
													isLoading
													loadingText='Создаем...'
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
													Создать
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
		</LayoutWrapper>
	);
}

export default CreateTheme