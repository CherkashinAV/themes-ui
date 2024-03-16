import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../store/hooks'
import {getNotifications} from '../store/slices/NotificationSlice';

export const useNotifications = () => {
	const {notifications} = useAppSelector((state) => state.notifications);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(getNotifications())
		const interval = setInterval(() => {
			dispatch(getNotifications())
		}, 30_000)
		return () => {clearInterval(interval)};
	}, [])

	return notifications;
}