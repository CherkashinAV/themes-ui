import {Box, Button, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Stack, Text} from '@chakra-ui/react'
import React, {useRef} from 'react'
import {Controller, useForm} from 'react-hook-form';
import {projectTypeMapping} from '../utils/themeUtils';
import {ThemeType} from '../types';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {createRule} from '../store/slices/RulesSlice';
import {userInfo} from 'os';

type AddRuleModalProps = {
	isOpen: boolean;
	onClose: () => void;
	organizationName: string;
}

type FormInput = {
	joinDate: string;
	realizationFrom: string;
	realizationTo: string;
	title: string;
	type: ThemeType;
	expirationDate: string;
}

const AddRuleModal = ({isOpen, onClose, organizationName}: AddRuleModalProps) => {
	const {control, watch, handleSubmit, reset} = useForm<FormInput>({
		defaultValues: {
			joinDate: '',
			realizationFrom: '',
			realizationTo: '',
			title: '',
			type: 'course',
			expirationDate: ''
		}
	});
	const dispatch = useAppDispatch();
	const {userInfo} = useAppSelector((state) => state.user);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const addRule = (formData: FormInput) => {
		let file: File | null = null;
		if (fileInputRef.current) {
			file = Array.from(fileInputRef.current.files ?? [])[0];
		}
		
		dispatch(createRule({
			joinDate: formData.joinDate,
			expirationDate: formData.expirationDate,
			title: formData.title,
			type: formData.type,
			realizationDates: {
				from: formData.realizationFrom,
				to: formData.realizationTo
			},
			file,
			organizationId: userInfo!.organization.id
		}));

		reset();
		onClose();
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
			<ModalHeader>Добавить новый регламент</ModalHeader>
			<ModalCloseButton />
			<form onSubmit={handleSubmit(addRule)}>
				<ModalBody>
					<Stack>
						<Box>
							<Text>Название</Text>
							<Controller
								name='title'
								control={control}
								render={({field}) => (
									<Input {...field} required name='title'/>
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

						<Flex alignItems={'center'} gap={3}>
							<Text>Действителен до</Text>
							<Controller
								name='expirationDate'
								control={control}
								render={({field}) => (
									<Input
										{...field}
										required
										width={'200px'}
										placeholder="Select Date and Time"
										size="md"
										type="date"
									/>
								)}
							/>
							
						</Flex>

						<Flex alignItems={'center'} gap={3}>
							<Text>Прием заявок до</Text>
							<Controller
								name='joinDate'
								control={control}
								render={({field}) => (
									<Input
										{...field}
										required
										width={'200px'}
										placeholder="Select Date and Time"
										size="md"
										type="date"
									/>
								)}
							/>
							
						</Flex>

						<Box>
							<Text>Сроки реализации проекта</Text>
							<Flex gap={3}>
								<Controller
									name='realizationFrom'
									control={control}
									render={({field}) => (
										<Input
											{...field}
											required
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
											required
											placeholder="Select Date and Time"
											size="md"
											type="date"
										/>
									)}
								/>
							</Flex>
						</Box>
						<Box>
							<Text>Загрузите файл регламента</Text>
							<Input ref={fileInputRef} type='file' required/>
						</Box>
					</Stack>
				</ModalBody>

				<ModalFooter>
					<Flex justifyContent={'center'} w={'100%'}>
						<Button colorScheme='blue' mr={3} type='submit'>
							Добавить
						</Button>
						<Button variant='ghost' colorScheme='red' onClick={onClose}>Закрыть</Button>
					</Flex>
				</ModalFooter>
			</form>
			</ModalContent>
		</Modal>
	)
}

export default AddRuleModal