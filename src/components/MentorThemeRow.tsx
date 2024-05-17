import React from 'react'
import {Theme} from '../types'
import {Badge, Box, Button, Divider, Flex, Grid, GridItem, Link, Menu, MenuButton, MenuItem, MenuList, Stack, Text} from '@chakra-ui/react'
import {DateTime, Settings} from 'luxon';
import {ChevronDownIcon} from '@chakra-ui/icons';
import {useAppDispatch} from '../store/hooks';
import {acceptRequest, clearState} from '../store/slices/MyThemesSlice';
import {Link as RouterLink} from 'react-router-dom';

const MentorThemeRow = ({theme}: {theme: Theme}) => {
  const executorsCount = theme.executorsGroup.participants.length + theme.joinRequests.length;
  const executors = theme.executorsGroup.participants.concat(theme.joinRequests.map((request) => request.user));
  const dispatch = useAppDispatch();
  Settings.defaultLocale = 'ru';

  const acceptRequestHandler = (userUid: string) => {
    dispatch(clearState());
		dispatch(acceptRequest({groupId: theme.executorsGroup.id, userUid, themeId: theme.id}))
	}

  return ( 
    <Box marginTop={5}>
      <Grid templateColumns='1.5fr 1.5fr 1fr 1fr 1fr' fontSize={15}>
        <GridItem w='100%' >
          <Stack>
            <Text>{theme.title}</Text>
            <Flex alignItems={'center'} gap={3}>
              <Text fontSize={13}>Участников</Text>
              <Badge textTransform={'none'}>{theme.executorsGroup.participants.length}/{theme.executorsGroup.size}</Badge>
            </Flex>
            <Flex gap={3} alignItems={'center'} wrap={'wrap'}>
              <Text fontSize={13}>Прием заявок до</Text>
              <Text fontSize={13} color={'blue.500'} textTransform={'none'}>{
                DateTime.fromISO(theme.joinDate).toLocaleString(DateTime.DATE_FULL)}
              </Text>
            </Flex>
            <Flex gap={3} alignItems={'center'} wrap={'wrap'}>
              <Text fontSize={13}>Сроки реализации проекта</Text>
              <Text fontSize={13} colorScheme={'blue'} textTransform={'none'} color={'blue.500'}>
                {DateTime.fromISO(theme.realizationDates?.from).toLocaleString(DateTime.DATE_FULL)}
              </Text>
              <Text color={'blue.500'}>-</Text>
              <Text fontSize={13} colorScheme={'blue'} textTransform={'none'} color={'blue.500'}>
                {DateTime.fromISO(theme.realizationDates?.to).toLocaleString(DateTime.DATE_FULL)}
              </Text>
            </Flex>
          </Stack>
        </GridItem>
        <GridItem w='100%' h={'100%'} rowSpan={executorsCount}>
          <Stack w={'100%'} h={'100%'}>
            {executors.map((user) => 
              <Flex h={'100%'} w={'100%'} alignItems={'center'} justifyContent={'center'}>
                <Link as={RouterLink} to={`/profile/${user.uid}`}>{`${user.surname} ${user.name} ${user.patronymic ?? ''}`}</Link>
              </Flex>
            )}
          </Stack>
        </GridItem>
        <GridItem w='100%' h={'100%'} rowSpan={executorsCount}>
          <Stack w={'100%'} h={'100%'} alignItems={'center'} textAlign={'center'}>
            {theme.executorsGroup.participants.map((user) => 
              <Flex h={'100%'} w={'100%'} alignItems={'center'} justifyContent={'center'}>
                <Badge colorScheme='green'>Утвержден</Badge>
              </Flex>
            )}
            {theme.joinRequests.map(({user}) => 
              <Flex h={'100%'} w={'100%'} alignItems={'center'} justifyContent={'center'}>
                <Badge colorScheme='blue'>Кандидат</Badge>
              </Flex>
            )}
          </Stack>
        </GridItem>
        <GridItem w='100%' h={'100%'} rowSpan={executorsCount}>
          <Stack w={'100%'} h={'100%'} alignItems={'center'} textAlign={'center'}>
            {theme.executorsGroup.participants.map((user) => 
              ''
            )}
            {theme.joinRequests.map(({requestDateTime}) =>
              <Flex h={'100%'} w={'100%'} alignItems={'center'} justifyContent={'center'}>
                <Text h={'100%'} w={'100%'} height={'fit-content'}>{DateTime.fromISO(requestDateTime).toLocaleString(DateTime.DATETIME_SHORT)}</Text>
              </Flex>
            )}
          </Stack>
        </GridItem>
        <GridItem w='100%' rowSpan={executorsCount} >
          <Stack alignItems={'center'} textAlign={'center'} w={'100%'} h={'100%'}>
            {executors.map((user) => 
              <Flex h={'100%'} w={'100%'} alignItems={'center'} justifyContent={'center'}>
                <Menu>
                  <MenuButton maxW={'100%'} padding={2} fontSize={13} height={'fit-content'} as={Button} rightIcon={<ChevronDownIcon />}>
                    Действие
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => acceptRequestHandler(user.uid)}>Утвердить</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            )}
          </Stack>
        </GridItem>
      </Grid>
      <Divider marginTop={5}/>
    </Box>
  )
}

export default MentorThemeRow