// hooks/useSession.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'token';

const useSession = () => {
	const [session, setSession] = useState(null);
	const [isLoading, setIsLoading] = useState(true); // Initialize loading state to true

	useEffect(() => {
		const loadSession = async () => {
			try {
				const savedSession = await AsyncStorage.getItem(SESSION_KEY);
				if (savedSession) {
					setSession(JSON.parse(savedSession)); // Parse the session if it's in JSON string format
				}
			} catch (error) {
				console.error('Failed to load session:', error);
			} finally {
				setIsLoading(false); // Set loading to false regardless of the outcome
			}
		};
		loadSession();
	}, []);

	const saveSession = async (newSession: any) => {
		try {
			await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
			setSession(newSession);
		} catch (error) {
			console.error('Failed to save session:', error);
		}
	};

	const clearSession = async () => {
		try {
			await AsyncStorage.removeItem(SESSION_KEY);
			setSession(null);
		} catch (error) {
			console.error('Failed to clear session:', error);
		}
	};

	return {
		session,
		isLoading, // Add isLoading to the returned object
		saveSession,
		clearSession,
	};
};

export default useSession;
