import React, { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import io from 'socket.io-client';
import { loadStorage } from '../utils/persistLocalStorage';
import { sendGetRequest } from '../apis/api';
import { ASSOCIATED_ROOMS } from '../utils/urls';
import RoomContext from '../contexts/RoomContext';
import UserContext from '../contexts/UserContext';
import SocketContext from '../contexts/SocketContext';

function AppLayout() {
	const navigate = useNavigate();

	const socketRef = useRef();

	const token = loadStorage('token');
	const user = loadStorage('user');

	const [rooms, setRooms] = useState([])
	const [activeRoom, setActiveRoom] = useState(null);
	const [showCreateRoomModal, setShowCreateRoomModal] = useState(false)
	const [showMembersList, setShowMembersList] = useState(true)

	useEffect(() => {
		/*
		 * If token is not present, redirect to login page
		 * If token is present, fetch associated rooms
		*/
		if (token && user) {
			navigate('/@me')
		} else {
			navigate('/auth/login')
		}
	}, [token]);

	useEffect(() => {
		fetchAssociatedRooms()
	}, [showCreateRoomModal]);

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
			})
			.catch((err) => {
				console.log(err);
			});
	}

	return (
		<RoomContext.Provider value={{ rooms, setRooms, activeRoom, setActiveRoom, showCreateRoomModal, setShowCreateRoomModal, showMembersList, setShowMembersList }}>
			<SocketContext.Provider value={{ socketRef }}>
				<UserContext.Provider value={{ user, token }}>
					<Outlet />
				</UserContext.Provider>
			</SocketContext.Provider>
		</RoomContext.Provider>
	)
}

export default AppLayout