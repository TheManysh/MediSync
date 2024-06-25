import axios from '../utils/axios';

const getReminderByUser = axios
	.get('/reminders/:userId')
	.then((res) => res.data)
	.catch((err) => console.log(err));

const createReminder = ({
	elder,
	medicine,
	time,
}: {
	elder: string;
	medicine: string;
	time: string;
}) =>
	axios.post('/reminders', {
		elder,
		medicine,
		time,
	});

export { getReminderByUser, createReminder };
