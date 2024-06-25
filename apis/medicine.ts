import axios from '../utils/axios';

const getMedicinesByUserId = axios
	.get('/medicines/:userId')
	.then((res) => res.data)
	.catch((err) => {
		console.log(err);
	});

const createMedicine = () =>
	axios
		.post('/medicines')
		.then((res) => res.data)
		.catch((err) => {
			console.log(err);
		});

export { getMedicinesByUserId, createMedicine };
