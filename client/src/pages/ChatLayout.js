import React, { useContext, useState } from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'
import Sidebar from '../components/sidebar/Sidebar'
import RoomContext from '../contexts/RoomContext';

function ChatLayout() {
	const roomContext = useContext(RoomContext);

	return (
		<div>
			<Sidebar
				rooms={roomContext.rooms}
				activeRoom={roomContext.activeRoom}
				setActiveRoom={roomContext.setActiveRoom}
			/>
			<div style={{
				flex: 1,
				// width: 'calc(100vw - 80px)',
				marginLeft: '70px',
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden'
			}}>
				<Outlet />
			</div>
		</div>
	)
}

export default ChatLayout