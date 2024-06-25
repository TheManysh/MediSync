import {
	Text,
	View,
	TextInput,
	Image,
	ScrollView,
	Pressable,
} from 'react-native';
import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Platform } from 'react-native';
// @ts-ignore
import RadioButtonGroup, { RadioButtonItem } from 'expo-radio-button';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from '@/utils/axios';
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// api
import { createElder } from '@/apis/elder';

import AsyncStorage from '@react-native-async-storage/async-storage';
import useSession from '@/hooks/useSession';
import { useRouter } from 'expo-router';

const elderly: any = [
	// {
	// 	name: 'Hajurma',
	// 	photo:
	// 		'https://hallow.com/wp-content/uploads/2023/09/Saints-in-7-Days_-Mother-Teresa-1.png',
	// },
];

export default function SettingsPage() {
	// use session
	const { session } = useSession();
	const formData = new FormData();
	// elderly detail
	const [name, setName] = useState('');
	const [tagId, setTagId] = useState('');
	const [phone, setPhone] = useState('');
	const [loading, setLoading] = useState(true);

	const router = useRouter();

	// bottomsheet
	const sheetRef = useRef<BottomSheet>(null);

	const snapPoints = useMemo(() => ['80%'], []);

	const handleClosePress = useCallback(() => {
		sheetRef.current?.close();
	}, []);

	const openBottomSheet = useCallback(() => {
		sheetRef.current?.expand();
	}, []);

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0}
				onPress={() => handleClosePress()}
			/>
		),
		[]
	);

	const Container = Platform.OS == 'web' ? ScrollView : BottomSheetScrollView;

	const [reminder, setReminder] = useState({
		sedentary: {
			enabled: false,
			time: 60,
		},
		water: {
			enabled: false,
			time: 60,
		},
	});

	const updateSedentary = (value: any) => {
		console.log(value);
		setReminder({
			...reminder,
			sedentary: {
				enabled: value === 'on',
				time: reminder.sedentary.time,
			},
		});
	};

	const updateWater = (value: any) => {
		console.log(value);
		setReminder({
			...reminder,
			water: {
				enabled: value === 'on',
				time: reminder.water.time,
			},
		});
	};

	const [image, setImage] = useState(null);

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.canceled) {
			setImage((result as any).assets[0].uri);
		}
	};

	const handleSubmit = async () => {
		if (!name || !tagId || !phone) {
			alert('Please fill all fields and select an image');
			return;
		}

		let formData = new FormData();
		formData.append('name', name);
		formData.append('tagId', tagId);
		formData.append('phone', phone);
		// @ts-ignore
		formData.append('file', {
			uri: image,
		});
		console.log(formData);
		try {
			const response = await axios.post('/elders', {
				method: 'POST',
				body: formData,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			console.log('Upload successful', response);
			alert('Upload successful');
		} catch (error) {
			console.error('Upload failed', error);
			alert('Upload failed');
		}
	};

	// logout
	const logout = async () => {
		await AsyncStorage.clear(() => console.log('cleared'));
		router.push('/');
	};

	// get elderly
	const [elderly, setElderly] = useState([]);
	const getElderly = async () => {
		try {
			const response = await axios.get('/elders');
			console.log(response.data.data.elders);
			setElderly(response.data.data.elders);
		} catch (error) {
			console.error('Failed to fetch elders:', error);
		}
	};

	useEffect(() => {
		getElderly();
		setLoading(false);
	}, []);

	if (loading) {
		return (
			<View className='flex items-center justify-center w-full h-full'>
				<Text>Loading...</Text>
			</View>
		);
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View className='flex items-center w-full h-full bg-white'>
				<View className='w-full h-full px-4 py-2 bg-white md:w-4/5 lg:w-3/5'>
					{/* Add elderly */}
					<View className='my-2'>
						<View className='flex flex-row items-center justify-between pb-2'>
							<Text className='text-lg font-semibold'>Add Elderly</Text>
							{elderly.length == 0 && (
								<Pressable
									className='px-4 py-3 bg-blue-400 rounded-lg'
									onPress={() => openBottomSheet()}
								>
									<Text className='font-semibold text-white'>Add</Text>
								</Pressable>
							)}
						</View>
						{
							// Elderly list
							elderly.length > 0 && (
								<View className='flex flex-row items-center justify-between p-3 border border-gray-300 rounded-lg border-1'>
									{elderly.map((elder: any) => (
										<View
											key={elder.name}
											className='flex flex-row items-center justify-center'
										>
											<View className='relative w-[20%] h-12'>
												<View className='flex items-center justify-center w-12 h-12 bg-blue-400 rounded-full'>
													<Image
														source={{
															uri:
																process.env.EXPO_PUBLIC_API_URL +
																'/uploads/' +
																elder.photo,
														}}
														style={{
															width: 50,
															height: 50,
															borderRadius: 1000,
														}}
													/>
												</View>
											</View>
											<View className='flex flex-row items-center justify-between w-4/5'>
												<View className='ml-4'>
													<Text className='text-lg font-semibold'>
														{elder.name}
													</Text>
													<Text>{elder.phone}</Text>
												</View>
												<View>
													<Pressable
														className='p-2 ml-4 bg-red-400 rounded-lg'
														onPress={() => setElderly([])}
													>
														<Text className='text-white'>Remove</Text>
													</Pressable>
												</View>
											</View>
										</View>
									))}
								</View>
							)
						}
					</View>
					{/* sedentary reminder */}
					<View className='py-2'>
						<View className='flex flex-row items-center justify-between'>
							<View className=''>
								<Text className='text-lg font-semibold'>
									Sedentary Reminder:
								</Text>
							</View>
							<View>
								<RadioButtonGroup
									containerStyle={{
										display: 'flex',
										flexDirection: 'row',
										gap: 10,
									}}
									selected={reminder.sedentary.enabled ? 'on' : 'off'}
									radioBackground='green'
									onSelected={(value: any) => updateSedentary(value)}
								>
									<RadioButtonItem value='off' label='Off' />
									<RadioButtonItem value='on' label='On' />
								</RadioButtonGroup>
							</View>
						</View>
						<View className='flex flex-row w-full my-2 overflow-hidden border border-gray-300 rounded-lg'>
							<TextInput
								aria-disabled={!reminder.sedentary.enabled}
								editable={reminder.sedentary.enabled}
								placeholder='60'
								value={
									reminder.sedentary.enabled
										? reminder.sedentary.time.toString() == '0'
											? ''
											: reminder.sedentary.time.toString()
										: ''
								}
								onChangeText={(value) => {
									if (value.toString() === '') {
										setReminder({
											...reminder,
											sedentary: {
												enabled: reminder.sedentary.enabled,
												time: value.toString() === '' ? 0 : Number(value),
											},
										});
									}
								}}
								className='w-4/5 p-2.5'
							/>
							<View className='w-1/5 p-2.5 bg-gray-400 '>
								<Text className='text-sm font-semibold text-gray-50'>
									Minutes
								</Text>
							</View>
						</View>
					</View>
					{/* water drinking reminder */}
					<View className='py-2'>
						<View className='flex flex-row items-center justify-between'>
							<View className=''>
								<Text className='text-lg font-semibold'>Water Reminder: </Text>
							</View>
							<View>
								<RadioButtonGroup
									containerStyle={{
										display: 'flex',
										flexDirection: 'row',
										gap: 10,
									}}
									selected={reminder.water.enabled ? 'on' : 'off'}
									radioBackground='green'
									onSelected={(value: any) => updateWater(value)}
								>
									<RadioButtonItem value='off' label='Off' />
									<RadioButtonItem value='on' label='On' />
								</RadioButtonGroup>
							</View>
						</View>
						<View className='flex flex-row w-full my-2 overflow-hidden border border-gray-300 rounded-lg'>
							<TextInput
								aria-disabled={!reminder.water.enabled}
								editable={reminder.water.enabled}
								placeholder='60'
								value={
									reminder.water.enabled
										? reminder.water.time.toString() == '0'
											? ''
											: reminder.water.time.toString()
										: ''
								}
								onChangeText={(value) => {
									if (value.toString() === '') {
										setReminder({
											...reminder,
											water: {
												enabled: reminder.water.enabled,
												time: value.toString() === '' ? 0 : Number(value),
											},
										});
									}
								}}
								className='w-4/5 p-2.5 border-r border-gray-300'
							/>
							<View className='w-1/5 p-2.5 bg-gray-400 '>
								<Text className='text-sm font-semibold text-gray-50'>
									Minutes
								</Text>
							</View>
						</View>
					</View>
					{/* group of button */}
					<View className='flex flex-row items-center justify-end gap-2'>
						<View className='px-2.5 py-1.5 bg-blue-400 rounded-lg'>
							<Text className='text-lg font-semibold text-white'>Save</Text>
						</View>
						<View className='px-2 py-1'>
							<Text className=''>Cancel</Text>
						</View>
					</View>
					{/* logout */}
					<View className='flex flex-row items-center justify-center gap-2 mt-2'>
						<Pressable
							onPress={() => logout()}
							className='w-full p-4 bg-red-400 rounded-lg'
						>
							<Text className='font-semibold text-center text-white'>
								Logout
							</Text>
						</Pressable>
					</View>
				</View>
				<BottomSheet
					ref={sheetRef}
					enablePanDownToClose={true}
					index={-1}
					backdropComponent={renderBackdrop}
					snapPoints={snapPoints}
				>
					<Container
						contentContainerStyle={{
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<Pressable
							onPress={() => handleClosePress()}
							className='absolute top-0 z-10 flex items-center justify-center w-8 h-8 bg-gray-100 border border-gray-300 rounded-full border-1 right-4'
						>
							<Ionicons size={24} name='close-outline'></Ionicons>
						</Pressable>
						<View className='flex items-center w-full h-first-line:full'>
							<View className='w-[80%]'>
								{/* Heading */}
								<View>
									<Text className='text-lg font-semibold'>Add Elderly</Text>
								</View>
								<View className='mt-2'>
									<Text className='py-2 font-semibold'>Name: </Text>
									<TextInput
										className='p-4 border border-gray-300 rounded-lg '
										placeholder='Name'
										value={name}
										onChangeText={(value) => setName(value)}
									/>
								</View>
								<View className='mt-2'>
									<Text className='py-2 font-semibold'>Tag ID: </Text>
									<TextInput
										onChangeText={(value) => setTagId(value)}
										value={tagId}
										className='p-4 border border-gray-300 rounded-lg '
										placeholder='TagId'
									/>
								</View>
								<View className='mt-2'>
									<Text className='py-2 font-semibold'>Phone: </Text>
									<TextInput
										onChangeText={(value) => setPhone(value)}
										value={phone}
										className='p-4 border border-gray-300 rounded-lg '
										placeholder='Phone number'
									/>
								</View>
								<View className='flex flex-row my-2'>
									{/* icon or uploaded picture */}
									{image ? (
										<View className='relative h-12 w-[20%]'>
											<View className='flex items-center justify-center w-12 h-12 rounded-full'>
												<Image
													source={{
														uri: image,
													}}
													className='w-12 h-12 rounded-full'
												/>
											</View>
										</View>
									) : (
										<View className='relative h-12 w-[20%]'>
											<View className='flex items-center justify-center w-12 h-12 bg-blue-400 rounded-full'>
												<Ionicons
													name='person-outline'
													size={24}
													color='white'
												/>
											</View>
										</View>
									)}
									<View className='flex justify-center'>
										<Pressable
											onPress={pickImage}
											className='p-2 border border-gray-300 rounded-lg border-1'
										>
											<Text className='font-semibold'>
												{image ? 'Reupload' : 'Upload'}
											</Text>
										</Pressable>
									</View>
								</View>
								<View>
									<Pressable
										className='w-full p-3 mt-2 text-white bg-blue-400 rounded-md shadow-md'
										onPress={handleSubmit}
									>
										<Text className='text-center text-white'>Add</Text>
									</Pressable>
								</View>
							</View>
						</View>
					</Container>
				</BottomSheet>
			</View>
		</GestureHandlerRootView>
	);
}
