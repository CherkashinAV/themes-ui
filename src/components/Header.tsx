import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import {Box, Button, Flex, IconButton, ListItem, Menu, MenuButton, MenuItem, MenuList, UnorderedList, Image, Link, Text, Icon, createIcon, Popover, PopoverTrigger, PopoverContent, Stack, Badge} from '@chakra-ui/react'
import React from 'react'
import logo from '../assets/images/logo.svg';
import logoutIcon from '../assets/images/logout.svg';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {logout} from '../store/slices/User';
import {useNotifications} from '../hooks/UseNotifications';
import Notification from './Notification';

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

const Header = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const {userInfo} = useAppSelector((state) => state.user);
	const notifications = useNotifications();

	const logoutHandler = () => {
		navigate('/auth/login');
		dispatch(logout());
	}

	return (
		<Box width={'100%'} height={'5vh'} bg={'gray.100'}>
			<Flex justifyContent={'space-between'} alignItems={'center'} h={'100%'} marginRight={10} marginLeft={10}>
				<Box width={8}>
					<Image src={logo}/>
				</Box>
				<UnorderedList listStyleType={'none'}>
					<Flex justifyContent={''} gap={50}>
						<ListItem>
							<Link as={RouterLink} to={'/theme/find'}>
								Найти проект
							</Link>
						</ListItem>
						<ListItem>
							<Link as={RouterLink} to={'/theme/create'}>
								Создать тему
							</Link>
						</ListItem>
					</Flex>
				</UnorderedList>
				<Flex>
					<Popover
						placement='bottom'
					>
						<PopoverTrigger>
							<Box w='fit-content' h='fit-content' position={'relative'}>
								<IconButton aria-label='notifications' icon={<BellIcon/>}/>
								{notifications.some((item) => item.new) && 
									<Badge 
										borderRadius={'100%'}
										width={2}
										height={2}
										bg={'blue.200'}
										position={'absolute'}
										bottom={3}
										right={3}
									/>
								}
							</Box>
						</PopoverTrigger>
						<PopoverContent overflowY={'scroll'} sx={scrollBarSettings}>
							<Stack gap={3} padding={2}>
								{notifications.map((notification, idx) => 
									<Notification key={idx} notification={notification}/>
								)}
							</Stack>
						</PopoverContent>
						
					</Popover>
					<Menu>
						<MenuButton as={Button} rightIcon={<ChevronDownIcon />} bg={'none'} _hover={{}} _active={{}}>
							{`${userInfo!.surname} ${userInfo!.name.charAt(0)}.В.`}
						</MenuButton>
						<MenuList>
							<MenuItem onClick={() => navigate(`/profile/${userInfo!.uid}`)}>
								Профиль
							</MenuItem>
							<MenuItem onClick={() => navigate(`/theme/my`)}>
								Мои темы
							</MenuItem>
							<MenuItem onClick={logoutHandler}>
								<Flex gap={3}>
									<Text>Выход</Text>
									<Image src={logoutIcon} w={3}/>
								</Flex>
							</MenuItem>
						</MenuList>
					</Menu>
				</Flex>
			</Flex>
		</Box>
	)
}

export default Header