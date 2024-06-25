import { login } from '@/apis/auth';
import useSession from '@/hooks/useSession';
import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginPage() {
	// State variables for inputs
	const [identity, setIdentity] = useState('manish@gmail.com');
	const [password, setPassword] = useState('manish123');

	const router = useRouter();
	const { session, isLoading, saveSession } = useSession();

	if (!session && isLoading) {
		// return spinner view
		return (
			<View>
				<Text>Loading...</Text>
			</View>
		);
	}

	if (session && !isLoading) {
		router.push('/home');
	}

	const onSubmit = () => {
		// Access identity and password directly from state
		console.log('submitted');
		login({ identity, password })
			.then((data) => {
				console.log(data.token);
				saveSession(data.token);
				router.push('/home');
			})
			.catch((err) => console.log(err));
	};

	return (
		<View className='relative flex items-center justify-end w-full h-full bg-white rounded-lg'>
			<View className='absolute w-full h-full bg-blue-400'></View>
			<View className='w-full p-6 bg-white rounded-t-xl'>
				<View className='w-full mb-4'>
					<Text className='text-sm font-semibold'>Email</Text>
					<TextInput
						editable={true}
						autoCapitalize='none'
						onChangeText={setIdentity}
						value={identity}
						className='p-3 bg-gray-200 border border-gray-400 rounded-lg'
					/>
				</View>
				<View className='w-full mb-4'>
					<Text className='text-sm font-semibold'>Password</Text>
					<TextInput
						secureTextEntry={true}
						editable={true}
						autoCapitalize='none'
						onChangeText={setPassword}
						value={password}
						className='p-3 bg-gray-200 border border-gray-400 rounded-lg'
					/>
				</View>
				<View className='flex flex-row justify-end gap-4'>
					<Pressable className='p-4 bg-blue-400 rounded-lg' onPress={onSubmit}>
						<Text className='font-semibold text-white'>Log in</Text>
					</Pressable>
					<Pressable
						className='p-4 bg-gray-200 rounded-lg'
						onPress={() => router.push('/signup')}
					>
						<Text className='font-semibold text-gray-600'>Sign up</Text>
					</Pressable>
				</View>
			</View>
		</View>
	);
}
