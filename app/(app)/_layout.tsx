import { NativeWindStyleSheet } from 'nativewind';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Fontisto } from '@expo/vector-icons';

NativeWindStyleSheet.setOutput({
	default: 'native',
});

export default function HomeLayout() {
	return (
		<BottomSheetModalProvider>
			<Tabs>
				<Tabs.Screen
					name='home/index'
					options={{
						title: 'Home',
						tabBarIcon: ({ color }) => (
							<Ionicons name='home-outline' size={16} color={color} />
						),
						headerShown: false,
					}}
				/>
				<Tabs.Screen
					name='medicines/index'
					options={{
						title: 'Medicines',
						tabBarIcon: ({ color }) => (
							<Fontisto name='pills' size={16} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name='reminders/index'
					options={{
						title: 'Reminders',
						headerTitle: 'Upcoming Reminders',
						tabBarIcon: ({ color }) => (
							<Ionicons name='alarm-outline' size={20} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name='notifications/index'
					options={{
						title: 'Notifications',
						tabBarIcon: ({ color }) => (
							<Ionicons name='notifications-outline' size={16} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name='settings/index'
					options={{
						title: 'Settings',
						tabBarIcon: ({ color }) => (
							<Ionicons name='settings-outline' size={16} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name='signup/index'
					options={{
						title: 'Signup',
						tabBarIcon: ({ color }) => (
							<Ionicons name='settings-outline' size={16} color={color} />
						),
						href: null,
					}}
				/>
			</Tabs>
		</BottomSheetModalProvider>
	);
}
