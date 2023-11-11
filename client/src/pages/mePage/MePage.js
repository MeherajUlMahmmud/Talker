import React, { useContext } from 'react'
import Navbar from '../../components/navbar/Navbar'
import FriendList from '../../components/friend_list/FriendList'
import './mePage.scss'
import MessageBody from '../../components/message_body/MessageBody'
import RoomContext from '../../contexts/RoomContext'

function MePage() {
	const { activeRoom } = useContext(RoomContext);

	return (
		<div className='me_page_wrapper'>
			<FriendList />
			<MessageBody />
		</div>
	)
}

export default MePage