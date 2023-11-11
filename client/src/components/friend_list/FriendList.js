import React from 'react'
import './friendList.scss'

function FriendList() {
	return (
		<div className='friend_list_wrapper'>
			<div className='friend_list'>
				{
					Array(30).fill(0).map((_, i) => (
						<div className='friend_list_item' key={i}>
							<div className='friend_list_item_avatar'>
								<img src="https://via.placeholder.com/150x150" alt="avatar" style={{
									width: '100%',
									height: '100%',
									borderRadius: '50%'
								}} />
							</div>
							<div className='friend_list_item_name'>
								<p>Friend {i + 1}</p>
							</div>
						</div>
					))
				}
			</div>
		</div>
	)
}

export default FriendList