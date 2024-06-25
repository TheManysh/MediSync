import {
	View,
	Text,
	FlatList,
	Pressable,
	TextInput,
	Platform,
} from 'react-native';
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
import useSession from '@/hooks/useSession';
import List from '@/components/List';

import axios from '@/utils/axios';
import { useRouter } from 'expo-router';

export default function MedicinePage() {
	// bottomsheet
	const sheetRef = useRef<BottomSheet>(null);
	const { session, isLoading } = useSession();

	const router = useRouter();

	const [medicines, setMedicines] = useState([]);
	const [name, setName] = useState('');
	const [quantity, setQuantity] = useState('');

	useEffect(() => {
		if (!session && !isLoading) {
			router.push('/');
		}
		fetchMedicines();
	}, [session]);

	// fetch medicines
	const fetchMedicines = async () => {
		try {
			const response = await axios.get('/medicines');
			console.log(response.data.data.medicines);
			setMedicines(response.data.data.medicines);
		} catch (error) {
			console.error('Failed to fetch medicines:', error);
		}
	};

	const addMedicine = async () => {
		try {
			const response = await axios.post('/medicines', {
				name,
				quantity,
			});
			console.log(response.data.data);
			fetchMedicines();
			clearFormAndCloseModal();
		} catch (error) {
			console.error('Failed to add medicine:', error);
		}
	};

	// clear form and bottom sheet
	const clearFormAndCloseModal = () => {
		setName('');
		setQuantity('');
		sheetRef.current?.close();
	};

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

	// time
	const [date, setDate] = useState(new Date());
	const [show, setShow] = useState(false);

	const onChange = (event: any, selectedDate: any) => {
		const currentDate = selectedDate;
		setShow(false);
		setDate(currentDate);
	};

	return (
		<GestureHandlerRootView className='w-full h-full'>
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
							data={medicines}
							//@ts-ignore
							keyExtractor={(item) => item._id}
							renderItem={({ item }) => <List data={item} />}
						/>
						<Pressable
							className='w-full p-3 text-white bg-blue-400 rounded-md shadow-md'
							onPress={() => openBottomSheet()}
						>
							<Text className='text-center text-white'>Add medicines</Text>
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
					<View className='p-6'>
						{/* Heading */}
						<View>
							<Text className='text-lg font-semibold'>Create Medicine</Text>
						</View>
						<View className='mt-2'>
							<Text className='py-2 font-semibold'>Name: </Text>
							<TextInput
								className='p-4 border border-gray-300 rounded-lg'
								value={name}
								onChangeText={(data) => setName(data)}
								placeholder='Name'
							/>
						</View>
						<View>
							<View className=''>
								<Text className='py-2 font-semibold'>Quantity: </Text>
								<TextInput
									className='p-4 border border-gray-300 rounded-lg'
									value={quantity}
									onChangeText={(text) =>
										setQuantity(text.replace(/[^0-9]/g, ''))
									}
									placeholder='Quantity'
									keyboardType='numeric'
								/>
							</View>
							<Pressable
								className='w-full p-3 mt-2 text-white bg-blue-400 rounded-md shadow-md'
								onPress={() => addMedicine()}
							>
								<Text className='text-center text-white'>Add Medicine</Text>
							</Pressable>
						</View>
					</View>
				</Container>
			</BottomSheet>
		</GestureHandlerRootView>
	);
}
