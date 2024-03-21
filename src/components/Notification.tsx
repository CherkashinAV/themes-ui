import {Badge, Button, Card, CardBody, CardHeader, Flex, Heading, Link, Text} from '@chakra-ui/react'
import React, {useEffect, useRef} from 'react'
import {Link as RouterLink} from 'react-router-dom';
import {NotificationType, Notification as NotificationInterface} from '../types'
import {useAppDispatch} from '../store/hooks';
import {lookNotification, mentorResponse} from '../store/slices/NotificationSlice';

const notificationHeaders: Record<NotificationType, string> = {
	INVITE_MENTOR: 'Приглашение ментора',
	MENTOR_RESPONSE: 'Решение ментора',
	THEME_STATUS: ''
}

const notificationsTexts: Record<NotificationType, (...args: any[]) => string> = {
	INVITE_MENTOR: () => 'Вы были приглашены в качестве ментора',
	MENTOR_RESPONSE: (name: string, status: 'accepted' | 'rejected') => 
		`${name} ${status === 'accepted' ? 'принял/a' : 'отклонил/a'} ваше приглашение`,
	THEME_STATUS: () => ''
}

const Notification = ({notification}: {notification: NotificationInterface}) => {
	const notificationRef = useRef<HTMLDivElement>(null);
	const dispatch = useAppDispatch();

	const onMouseoverHandler = (() => {
		if (!notification.new) {
			return;
		}

		dispatch(lookNotification(notification.id))
	})

	const handleMentorResponse = ((action: 'accept' | 'reject') => {
		dispatch(mentorResponse({
			action,
			notificationId: notification.id,
			themeId: (notification.attributes as any).themeId
		}));
	});

	useEffect(() => {
		if (notificationRef.current && notification.new) {
			notificationRef.current.addEventListener('mouseover', onMouseoverHandler);
		}

		return () => {notificationRef.current?.removeEventListener('mouseover', onMouseoverHandler);}
	});

	return (
		<Card ref={notificationRef}>
			<CardBody>
				<Flex alignItems={'center'} gap={3}>
					<Heading fontSize={12}>{notificationHeaders[notification.type]}</Heading>
					{notification.new && <Badge borderRadius={'100%'} width={2} height={2} bg={'blue.200'}/>}
				</Flex>
				{notification.type === 'INVITE_MENTOR' &&
					<>
					<Text fontSize={12}>{notificationsTexts[notification.type]()}</Text>
					<Link fontSize={12} as={RouterLink} to={`/theme/${(notification.attributes as any).themeId}`}>Перейти к теме</Link>
					<Flex gap={3} marginTop={2}>
						<Button
							fontSize={12}
							padding={2}
							variant={'solid'}
							colorScheme={'blue'}
							onClick={() => handleMentorResponse('accept')}
						>
							Принять
						</Button>
						<Button
							fontSize={12}
							padding={2}
							variant={'outline'}
							colorScheme={'red'}
							onClick={() => handleMentorResponse('reject')}
						>
							Отказать
						</Button>
					</Flex>
					</>
				}

				{notification.type === 'MENTOR_RESPONSE' &&
					<>
					<Text fontSize={12}>
						{notificationsTexts[notification.type](
							(notification.attributes as any).mentorName, 
							(notification.attributes as any).status
						)}
					</Text>
					<Link fontSize={12} as={RouterLink} to={`/theme/${(notification.attributes as any).themeId}`}>Перейти к теме</Link>
					</>
				}
			</CardBody>
		</Card>
	)
}

export default Notification