import axios from 'axios';

axios.interceptors.response.use(
	response => response.data,
	error => {
		let errorMessage = '';
		if (error.response) {
			const {status, statusText} = error.response;
			errorMessage = statusText;
			if (status === 401) {
				errorMessage += '. You maybe need to login again.';
			}
		} else {
			errorMessage = 'Unknown Error';
		}

		throw new Error(errorMessage);
	},
);

export default axios;
