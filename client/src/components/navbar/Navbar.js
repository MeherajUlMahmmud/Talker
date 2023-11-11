import React, { useContext } from 'react'
import './navbar.scss'
import RoomContext from '../../contexts/RoomContext';

function Navbar() {
	const { activeRoom, showMembersList, setShowMembersList } = useContext(RoomContext);

	return (
		<div className='navbar_wrapper'>
			<Header title={activeRoom?.name} />
			<div className='navbar_right'>
				{
					activeRoom && (
						<div className={`navbar_item ${showMembersList && 'active'}`}
							onClick={() => setShowMembersList(!showMembersList)}
						>
							<i className="fas fa-users"></i>
						</div>
					)
				}
			</div>
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