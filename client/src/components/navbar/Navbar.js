import React, { useContext } from 'react'
import './navbar.scss'
import RoomContext from '../../contexts/RoomContext';

function Navbar() {

	const roomContext = useContext(RoomContext);

	console.log(roomContext);

	return (
		<div className='navbar_wrapper'>
			<Header title={roomContext?.activeRoom?.name} />
		</div>
	)
}

const Header = ({ title }) => {
	return (
		<div className='header_wrapper'>
			<p className='title'>
				{
					title ? title : 'Talker'
				}
			</p>
		</div>
	)
}

export default Navbar