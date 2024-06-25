import axios from '@/utils/axios';

const login = ({
	identity,
	password,
}: {
	identity: string;
	password: string;
}) =>
	axios
		.post('/auth/signin', { identity, password })
		.then((res) => res.data.data)
		.catch((err) => {
			console.log(err.response.data);
		});
const signup = ({
	firstname,
	lastname,
	email,
	password,
}: {
	firstname: string;
	lastname: string;
	email: string;
	password: string;
}) =>
	axios
		.post('/auth/signup', {
			firstname,
			lastname,
			email,
			password,
		})
		.then((res) => res.data)
		.catch((err) => {
			console.log(err);
		});

export { login, signup };
