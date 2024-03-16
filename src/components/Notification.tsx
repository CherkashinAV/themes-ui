import {Badge, Card, CardBody, CardHeader, Flex, Heading, Link, Text} from '@chakra-ui/react'
import React from 'react'
import {Link as RouterLink} from 'react-router-dom';
import {NotificationType, Notification as NotificationInterface} from '../types'
import Header from './Header';

const notificationHeaders: Record<NotificationType, string> = {
	INVITE_MENTOR: 'Приглашение ментора',
	MENTOR_RESPONSE: '',
	THEME_STATUS: ''
}

const notificationsTexts: Record<NotificationType, string> = {
	INVITE_MENTOR: 'Вы были приглашены в качестве ментора',
	MENTOR_RESPONSE: '',
	THEME_STATUS: ''
}

const Notification = ({notification}: {notification: NotificationInterface}) => {
	return (
		<Card>
			<CardBody>
				<Flex alignItems={'center'} gap={3}>
					<Heading fontSize={12}>{notificationHeaders[notification.type]}</Heading>
					{notification.new && <Badge borderRadius={'100%'} width={2} height={2} bg={'blue.200'}/>}
				</Flex>
				<Text fontSize={12}>{notificationsTexts[notification.type]}</Text>
				<Link fontSize={12} as={RouterLink} to={`/theme/${(notification.attributes as any).themeId}`}>Перейти к теме</Link>
			</CardBody>
		</Card>
	)
}

export default Notification