import React from 'react'
import './sidebar.scss'

function Sidebar({ rooms, activeRoom, setActiveRoom }) {
	console.log(activeRoom);
	return (
		<div className='sidebar_wrapper'>
			<div className='room_item'>
				<div className='room_logo'>
					<i className="fa-brands fa-discord"></i>
				</div>
			</div>
			{
				rooms.map((room) => {
					return (
						<div className="room_item"
							key={room?._id}
							onClick={() => setActiveRoom(room)}
						>
							{/* <img src={`https://via.placeholder.com/468x300?text=${room?.name[0].toUpperCase()}`} className="room_logo" alt="" /> */}
							<div className={`room_logo ${activeRoom?._id === room?._id ? 'active' : ''}`}>
								{room?.name[0].toUpperCase()}
							</div>
						</div>
					)
				})
			}
			<div className='room_item'>
				<div className='room_logo'>+</div>
			</div>
		</div>
	)
}

export default Sidebar