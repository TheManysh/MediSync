import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.request.use(
	async (config) => {
		try {
			let token: any = await AsyncStorage.getItem('token');
			token = JSON.parse(token);
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
				console.log('headers', config.headers);
			} else {
				console.log('no token');
			}
		} catch (error) {
			console.log('error', error);
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export default axiosInstance;
