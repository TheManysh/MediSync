// contexts/SecureSessionContext.js
import React, { createContext } from 'react';
import useSession from '@/hooks/useSession';

const SessionContext = createContext({});

export const SessionProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const session = useSession();
	return (
		<SessionContext.Provider value={session}>
			{children}
		</SessionContext.Provider>
	);
};
