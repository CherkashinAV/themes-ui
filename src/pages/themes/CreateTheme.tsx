import React, {useState} from 'react'
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
	Button
} from '@chakra-ui/react';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {useAppSelector} from '../../store/hooks';
import {ThemeType} from '../../types';

type FormInput = {
	title: string,
	shortDescription: string,
	description: string,
	executorsCount: number,
	type: ThemeType,
	private: string
}

const CreateTheme = () => {
	const {control, watch, handleSubmit} = useForm<FormInput>({
		defaultValues: {
			title: '',
			shortDescription: '',
			description: '',
			executorsCount: 1,
			type: 'course',
			private: 'false'
		}
	});
	const {isFetching, isSuccess, isError, errorMessage} = useAppSelector((state) => state.login);

	const labelStyles = {
		mt: '2',
		ml: '-2.5',
		fontSize: 'sm',
	};

	const projectType = {
		course: 'Курсовая работа',
		graduation: 'Выпускная работа',
		contest: 'Конкурсная работа',
		pet: 'Pet-проект',
		hackaton: 'Хакатон'
	}

	const onSubmit: SubmitHandler<FormInput> = (data) => {
		console.log(data)
	};

	return (
		<Flex
			minH={"100vh"}
			align={"center"}
			justify={"center"}
			bg={useColorModeValue("gray.50", "gray.800")}
		>
			<Card
				rounded={"lg"}
                bg={useColorModeValue("white", "gray.700")}
                boxShadow={"lg"}
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
												{Object.entries(projectType).map(
													([key, value]) => {
														return <option key={key} value={value}>{value}</option>
													})
												}
											</Select>
										)}
									/>
									
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
	);
}

export default CreateTheme