import axios from '@/utils/axios';
import { Platform } from 'react-native';

const createElder = ({
	name,
	tagId,
	phone,
	photo,
}: {
	name: string;
	tagId: string;
	phone: string;
	photo?: string | null;
}) =>
	axios
		.post('/elders', {
			name,
			tagId,
			phone,
			photo: Platform.OS === 'android' ? photo : photo?.replace('file://', ''),
		})
		.then((res) => res.data)
		.catch((err) => console.log(err.response.data));

const getElderByUserId = () =>
	axios
		.get('/elders/:userId')
		.then((res) => res.data)
		.catch((err) => console.log(err));

const removeElder = (elderId: string) =>
	axios
		.delete(`/elders/${elderId}`)
		.then((res) => res.data)
		.catch((err) => console.log(err));

export { createElder, getElderByUserId, removeElder };
