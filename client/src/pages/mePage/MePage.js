import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import FriendList from '../../components/friend_list/FriendList'

function MePage() {
	return (
		<div className='page_wrapper'>
			<Navbar />
			<div className='me_page_wrapper'>
				<FriendList />
			</div>
		</div>
	)
}

export default MePage