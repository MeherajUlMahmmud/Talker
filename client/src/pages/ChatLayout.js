import React, { useContext, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import io from 'socket.io-client';
import Sidebar from '../components/sidebar/Sidebar'
import RoomContext from '../contexts/RoomContext';
import Navbar from '../components/navbar/Navbar';
import UserContext from '../contexts/UserContext';
import SocketContext from '../contexts/SocketContext';

function ChatLayout() {
	const navigate = useNavigate();

	const { rooms, activeRoom, setActiveRoom } = useContext(RoomContext);
	const { socketRef } = useContext(SocketContext);
	const { user, token } = useContext(UserContext);

	useEffect(() => {
		if (token && user) {
			socketRef.current = io('http://localhost:8001', {
				// socketRef.current = io(process.env.REACT_APP_SERVER_URL, {
				// query: {
				// 	token: userContext?.token,
				// 	user: userContext?.user?._id
				// }
			});
			socketRef.current.on('connect', () => {
				console.log('Connected to socket');
				socketRef.current.on('disconnect', () => {
					console.log('Disconnected from socket');
				});
			});
		} else {
			navigate('/auth/login')
		}

		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
			}
		}
	}, [token]);

	return (
		<div style={{
			display: 'flex',
			flexDirection: 'row',
			height: '100vh',
			overflow: 'hidden'
		}}
		>
			<Sidebar
				rooms={rooms}
				activeRoom={activeRoom}
				setActiveRoom={setActiveRoom}
			/>
			<div style={{
				marginLeft: '70px',
				// display: 'flex',
				// flexDirection: 'column',
				// overflow: 'hidden'
			}}>
				<div className='page_wrapper'>
					<Navbar />
					<Outlet />
				</div>
			</div>
		</div>
	)
}

export default ChatLayout