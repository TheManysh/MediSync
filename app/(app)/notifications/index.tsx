import {
	View,
	Text,
	Pressable,
	ScrollView,
	Image,
	AppState,
} from 'react-native';
import { useState, useEffect } from 'react';

import axios from '@/utils/axios';

import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

const Notification = ({ type, elder }: any) => {
	return (
		<View className='p-4 mb-4 bg-white border border-gray-300 rounded-lg border-1'>
			<View className='flex flex-row'>
				<View className='relative h-12 w-[20%]'>
					{elder.photo ? (
						<View className='flex items-center justify-center w-12 h-12 bg-blue-400 rounded-full'>
							<Image
								source={{
									uri:
										process.env.EXPO_PUBLIC_API_URL + '/uploads/' + elder.photo,
								}}
								style={{
									width: 48,
									height: 48,
									borderRadius: 24,
								}}
							/>
						</View>
					) : (
						<View className='flex items-center justify-center w-12 h-12 bg-blue-400 rounded-full'>
							<Ionicons name='person-outline' size={24} color='white' />
						</View>
					)}
				</View>
				<View className='w-[80%]'>
					{type === 'missed' ? (
						<View>
							<Text className='text-lg font-semibold'>
								{elder.name} missed a dosage!
							</Text>
							<Text>Call her to remind 💊</Text>
						</View>
					) : (
						<View>
							<Text className='text-lg font-semibold'>
								{elder.name} fall detected!
							</Text>
							<Text>Call her to check on her 🚑</Text>
						</View>
					)}
				</View>
			</View>
			<View className='mt-4'>
				<Pressable
					onPress={() => Linking.openURL('tel:' + elder.phone)}
					className='flex flex-row items-center justify-center w-full p-3 text-white bg-blue-400 rounded-md shadow-md'
				>
					<View className='mr-2'>
						<Ionicons name='call' size={16} color='white' />
					</View>
					<View>
						<Text className='font-semibold text-white'>Call her</Text>
					</View>
				</Pressable>
			</View>
		</View>
	);
};

export default function NotificationPage() {
	const [notifications, setNotifications] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchNotifications = () => {
			axios
				.get('/notifications')
				.then((res) => {
					setNotifications(res.data.data.notifications);
					console.log(notifications);
					setIsLoading(false);
				})
				.catch((err) => console.log(err));
		};

		// Call fetchNotifications initially
		fetchNotifications();

		// Set up an interval to call fetchNotifications every 10 seconds
		const intervalId = setInterval(fetchNotifications, 2000); // 10000 milliseconds = 10 seconds

		// Clean up the interval on component unmount
		return () => clearInterval(intervalId);
	}, []);

	const handleClearAll = () => {
		axios
			.delete('/notifications')
			.then((res) => {
				setNotifications([]);
			})
			.catch((err) => console.log(err));
	};

	if (isLoading) {
		return (
			<View className='flex items-center justify-center w-full h-full'>
				<Text>Loading...</Text>
			</View>
		);
	}

	return (
		<ScrollView
			contentContainerStyle={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
			className='w-full h-full bg-white'
		>
			<View className='w-full h-full px-6 py-4 md:w-4/5 lg:w-3/5'>
				{/* list reminder  */}
				<View>
					{notifications.length != 0 ? (
						notifications.map((notification) => (
							<Notification
								type={notification.type}
								elder={notification.elder}
								key={notification._id}
							/>
						))
					) : (
						<Text>No notifications</Text>
					)}
				</View>
				{/* Press button */}
				{notifications.length != 0 && (
					<View className='flex flex-row items-center justify-center'>
						<Pressable
							onPress={() => handleClearAll()}
							className='w-full p-4 bg-red-400 border-red-400 rounded-lg border-1'
						>
							<Text className='font-semibold text-center text-white'>
								Clear all notifications
							</Text>
						</Pressable>
					</View>
				)}
			</View>
		</ScrollView>
	);
}
