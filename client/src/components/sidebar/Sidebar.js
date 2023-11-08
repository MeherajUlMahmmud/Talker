import React from 'react'
import './sidebar.scss'

function Sidebar({ rooms }) {
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
						>
							{/* <img src={`https://via.placeholder.com/468x300?text=${room?.name[0].toUpperCase()}`} className="room_logo" alt="" /> */}
							<div className='room_logo'>{room?.name[0].toUpperCase()}
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