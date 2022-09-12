import axios from 'axios';

axios.interceptors.response.use(
	response => response.data,
);

export default axios;
