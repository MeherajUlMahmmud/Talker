import React, { useState } from 'react'
import { loadStorage } from '../../utils/persistLocalStorage';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

function ProfilePage() {
	const token = loadStorage('token');
	const [user, setUser] = useState(loadStorage('user'));
	const navigate = useNavigate();

	return (
		<div className="container mx-auto shadow-lg rounded-lg">
			<Navbar user={user} />
			<div class="bg-gray-100 p-8">
				<div class="max-w-md mx-auto bg-white shadow-md rounded-md p-6">
					<div class="text-center">
						<img src="user-avatar.jpg" alt="User Avatar" class="w-20 h-20 rounded-full mx-auto mb-4" />
						<h2 class="text-xl font-semibold">John Doe</h2>
						<p class="text-gray-600">@johndoe</p>
					</div>
				</div>
			</div>
		</div >
	)
}

export default ProfilePage