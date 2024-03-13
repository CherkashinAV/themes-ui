import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import {Box, Button, Flex, IconButton, ListItem, Menu, MenuButton, MenuItem, MenuList, UnorderedList, Image, Link, Text, Icon, createIcon} from '@chakra-ui/react'
import React from 'react'
import logo from '../assets/images/logo.svg';
import logoutIcon from '../assets/images/logout.svg';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {logout} from '../store/slices/User';

const Header = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const {userInfo} = useAppSelector((state) => state.user);

	const logoutHandler = () => {
		navigate('/auth/login');
		dispatch(logout());
	}

	return (
		<Box width={'100%'} height={14} bg={'gray.100'}>
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
					<IconButton aria-label='notifications' icon={<BellIcon/>}/>
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