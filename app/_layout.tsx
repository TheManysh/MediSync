import { SessionProvider } from '@/contexts/SessionContext';
import { Slot } from 'expo-router';
import useSession from '@/hooks/useSession';
import { useRouter } from 'expo-router';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<Slot />
		</SessionProvider>
	);
}
