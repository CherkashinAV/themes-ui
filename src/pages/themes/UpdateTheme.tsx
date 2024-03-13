import React, {useEffect, useMemo, useState} from 'react'
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
	Spinner
} from '@chakra-ui/react';
import {useForm, Controller, SubmitHandler, UseFormReturn} from 'react-hook-form';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {ThemeType} from '../../types';
import {useNavigate, useParams} from 'react-router-dom';
import {projectTypeMapping} from '../../utils/themeUtils';
import {updateTheme} from '../../store/slices/UpdateThemeSlice';
import {getTheme} from '../../store/slices/ThemeSlice';
import LayoutWrapper from '../../components/LayoutWrapper';

type FormInput = {
	title: string,
	shortDescription: string,
	description: string,
	executorsCount: number,
	type: ThemeType,
	private: string
}

const UpdateTheme = () => {
	const {themeId} = useParams()
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const {isFetching, isSuccess, isError, errorMessage} = useAppSelector((state) => state.updateTheme);
	const {data} = useAppSelector((state) => state.theme);

	const formControls = useForm<FormInput>({
		defaultValues: useMemo(() => {
			return {
				title: data?.title,
				shortDescription: data?.shortDescription,
				description: data?.description,
				executorsCount: data?.executorsGroup.size,
				type: data?.type,
				private: data?.private.toString()
			}
		}, [data])
	});

	const labelStyles = {
		mt: '2',
		ml: '-2.5',
		fontSize: 'sm',
	};

	const onSubmit: SubmitHandler<FormInput> = async (formData) => {
		dispatch(updateTheme({
			id: data!.id,
			...formData,
			private: formData.private === 'true'
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

	return (
		<LayoutWrapper>
			{data ?
				<Flex
					h={'100%'}
					align={"center"}
					justify={"center"}
					bg="gray.50"
				>
					<Card
						rounded={"lg"}
						bg={"white"}
						boxShadow={"lg"}
						w={"60%"}
						p={8}
					>
						<CardBody>
							<Stack>
								<Heading textAlign={'center'} marginBottom={10}>Редактирование темы</Heading>
								<form onSubmit={formControls.handleSubmit(onSubmit)}>
									<Stack spacing={8}>
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
											<Text>Тип работы</Text>
											<Controller
												name="type"
												control={formControls.control}
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
											<Controller
												name='private'
												control={formControls.control}
												render={({field}) => (
													<Switch {...field} name='private' defaultChecked={data!.private}>
														Сделать приватной темой для вашей организации
													</Switch>
												)}
											/>
											
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