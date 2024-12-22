import axios from 'axios';

export const getUser = async () => {
	try {
		const token = localStorage.getItem('jwt');
		const config = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		
		const response = await axios.get(`https://${location.host}/api/user/`, config);

		return response.data;
	} catch (error) {
		console.error(`Error fetching user data:`, error);
		throw error;
	}
};

// POST METHODS

export const createUser = async (myData) => {
	try {
		const token = localStorage.getItem('jwt');
		const config = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
		
		const response = await axios.post("http://localhost:8000/user/createUser", myData, config);

		return response.data;
	} catch (error) {
		console.error(`Error fetching user data:`, error);
		throw error;
	}
};