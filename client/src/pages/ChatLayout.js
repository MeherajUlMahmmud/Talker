import React from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'
import Sidebar from '../components/sidebar/Sidebar'

function ChatLayout() {

	const [rooms] = useOutletContext();

	return (
		<div>
			<Sidebar rooms={rooms} />
			<Outlet />
		</div>
	)
}

export default ChatLayout