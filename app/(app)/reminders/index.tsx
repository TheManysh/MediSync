import {
	View,
	Text,
	FlatList,
	Pressable,
	TextInput,
	Platform,
	Alert,
} from 'react-native';
import List from '@/components/List';
import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
	ScrollView,
	GestureHandlerRootView,
} from 'react-native-gesture-handler';
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import DateTimePicker from '@react-native-community/datetimepicker';
import { createReminder } from '@/apis/reminder';
import axios from '@/utils/axios';
import useSession from '@/hooks/useSession';
import { useRouter } from 'expo-router';

export default function ReminderPage() {
	const [listMedicines, setListMedicines] = useState([]);
	const [listElders, setListElders] = useState([]);
	const [medicine, setMedicine] = useState('');
	const [reminders, setReminders] = useState([]);
	const [elder, setElder] = useState('');

	const { session, isLoading } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (!session && !isLoading) {
			router.push('/');
		}
		searchMedicines();
		searchElders();
		fetchReminders();
	}, [session]);

	// fetch reminders
	const fetchReminders = async () => {
		const response = await axios.get(`/reminders`);
		console.log(response.data.data.reminders);
		setReminders(response.data.data.reminders);
	};

	// get medicine by search
	const searchMedicines = async () => {
		const response = await axios.get(`/medicines`);
		setListMedicines(response.data.data.medicines);
		setMedicine(response.data.data.medicines[0]._id);
	};

	// get elder by search
	const searchElders = async () => {
		const response = await axios.get(`/elders`);
		setListElders(response.data.data.elders);
		setElder(response.data.data.elders[0]._id);
	};

	// bottomsheet
	const sheetRef = useRef<BottomSheet>(null);

	const snapPoints = useMemo(() => ['100%'], []);

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

	// time
	const [date, setDate] = useState(new Date());
	const [show, setShow] = useState(false);

	const onChange = (event: any, selectedDate: any) => {
		console.log(
			date.getHours().toString().padStart(2, '0'),
			date.getMinutes().toString().padStart(2, '0')
		);
		const currentDate = selectedDate;
		setShow(false);
		setDate(currentDate);
	};

	// create new remimder
	const handleCreateReminder = () => {
		// check if the medicine and elder exist
		if (!medicine.trim() || !elder.trim()) {
			return Alert.alert('Please fill in all fields');
		}
		// create reminder
		createReminder({
			medicine,
			elder,
			time: `${date.getHours().toString().padStart(2, '0')}:${date
				.getMinutes()
				.toString()
				.padStart(2, '0')}`,
		})
			.then((res) => {
				console.log(res);
				// close the bottomsheet
				handleClosePress();
			})
			.catch((err) => console.log(err));
		fetchReminders();
	};

	return (
		<GestureHandlerRootView>
			<ScrollView
				contentContainerStyle={{
					display: 'flex',
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}
				className='w-full h-full bg-white'
			>
				<View className='w-full h-full px-4 py-2 md:w-4/5 lg:w-3/5'>
					{/* list reminder  */}
					<View className='p-2'>
						<FlatList
							data={reminders}
							//@ts-ignore
							renderItem={({ item }) => <List data={item} key={item._id} />}
						/>
						<Pressable
							className='w-full p-3 text-white bg-blue-400 rounded-md shadow-md'
							onPress={() => openBottomSheet()}
						>
							<Text className='text-center text-white'>Add reminder</Text>
						</Pressable>
					</View>
				</View>
			</ScrollView>
			<BottomSheet
				ref={sheetRef}
				enablePanDownToClose={true}
				index={-1}
				backdropComponent={renderBackdrop}
				snapPoints={snapPoints}
			>
				<Container>
					<Pressable
						onPress={() => handleClosePress()}
						className='absolute top-0 z-10 flex items-center justify-center w-8 h-8 bg-gray-100 border border-gray-300 rounded-full border-1 right-4'
					>
						<Ionicons size={24} name='close-outline'></Ionicons>
					</Pressable>
					<Container style={{ padding: 20 }}>
						{/* Heading */}
						<View>
							<Text className='text-lg font-semibold'>Create reminder</Text>
						</View>

						{/* picker */}
						<View className=''>
							<Text className='py-2 font-semibold'>Medicine: </Text>
							<Picker
								selectedValue={medicine}
								onValueChange={(itemValue, itemIndex) => {
									setMedicine(itemValue);
								}}
							>
								{listMedicines.map((item: any) => (
									<Picker.Item
										label={item.name}
										value={item._id}
										key={item._id}
									/>
								))}
							</Picker>
						</View>
						<View>
							<View className='flex flex-row items-center justify-between w-full py-2'>
								<View className='flex items-center'>
									<Text className='font-semibold'>Time:</Text>
								</View>
								<View>
									<DateTimePicker
										testID='dateTimePicker'
										value={date}
										mode={'time'}
										is24Hour={false}
										onChange={onChange}
									/>
								</View>
							</View>

							<View className=''>
								<Text className='py-2 font-semibold'>Elderly: </Text>
								{/* picker for elder */}
								<Picker
									selectedValue={elder}
									onValueChange={(itemValue, itemIndex) => {
										console.log(itemValue);
										setElder(itemValue);
									}}
								>
									{listElders.map((item: any) => (
										<Picker.Item
											label={item.name}
											value={item._id}
											key={item._id}
										/>
									))}
								</Picker>
							</View>
							<Text>
								{JSON.stringify({
									elder,
									medicine,
									time: `${date.getHours().toString().padStart(2, '0')}:${date
										.getMinutes()
										.toString()
										.padStart(2, '0')}`,
								})}
							</Text>
							<Pressable
								className='w-full p-3 mt-2 mb-8 text-white bg-blue-400 rounded-md shadow-md'
								onPress={handleCreateReminder}
							>
								<Text className='text-center text-white'>Add reminder</Text>
							</Pressable>
						</View>
					</Container>
				</Container>
			</BottomSheet>
		</GestureHandlerRootView>
	);
}
