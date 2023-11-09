import React, { createContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { loadStorage } from '../utils/persistLocalStorage';
import { sendGetRequest } from '../apis/api';
import { ASSOCIATED_ROOMS } from '../utils/urls';
import RoomContext from '../contexts/RoomContext';

function AppLayout() {
	const navigate = useNavigate();

	const token = loadStorage('token');
	const user = loadStorage('user');

	const [rooms, setRooms] = useState([])
	const [activeRoom, setActiveRoom] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");


	useEffect(() => {
		/*
		 * If token is not present, redirect to login page
		 * If token is present, fetch user details and connect to socket
		 * If socket is connected, fetch associated rooms
		*/
		if (token && user) {
			navigate('/@me')
			fetchAssociatedRooms()
		} else {
			navigate('/auth/login')
		}
	}, [token])



	const fetchAssociatedRooms = () => {
		/*
		 * Fetch associated rooms
		 * If successful, set rooms and active room
		 * If unsuccessful, display the error message
		 * Set loading to false
		*/
		sendGetRequest(ASSOCIATED_ROOMS + '/' + user?._id, token)
			.then((res) => {
				console.log(res?.data);
				setRooms(res?.data?.rooms)
				setIsLoading(false)
			})
			.catch((err) => {
				console.log(err);
				setError(err?.response?.data || "Something went wrong");
				setIsLoading(false);
			});
	}

	return (
		<RoomContext.Provider value={{ rooms, setRooms, activeRoom, setActiveRoom }}>
			<Outlet
			// context={[rooms]}
			/>
		</RoomContext.Provider>
	)
}

export default AppLayout