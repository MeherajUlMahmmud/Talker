import React from 'react'
import './friendList.scss'

function FriendList() {
	return (
		<div className='friend_list_wrapper'>
			{
				Array(30).fill(0).map((_, i) => (
					<div className='friend_list_item' key={i}>
						<div className='friend_list_item_avatar'>
							<img src="https://via.placeholder.com/150" alt="avatar" />
						</div>
						<div className='friend_list_item_details'>
							<div className='friend_list_item_details_name'>
								<p>Friend {i + 1}</p>
							</div>
						</div>
					</div>
				))
			}
		</div>
	)
}

export default FriendList