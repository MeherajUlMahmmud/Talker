import React from 'react'

function Navbar({ user }) {
	return (
		<div className="px-5 py-3 flex justify-between items-center bg-white border-b-2">
			<a
				className="font-semibold text-xl text-indigo-600"
				href="/"
			>TALKER</a>
			{
				user ?
					(
						<a
							className="px-3 py-1 bg-green-500 text-white rounded-md font-semibold flex items-center justify-center"
							href="/profile"
						>
							{user?.username || 'User'}
						</a>
					)
					:
					(
						<div
							className="h-12 flex items-center justify-center"
						>
							<a
								className='rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 m-2 text-white shadow-sm border-indigo-600 border-2 hover:bg-white hover:text-indigo-600 hover:border-2'
								href="/login"
							>
								Login
							</a>
							<a
								className='rounded-md px-3 py-1.5 text-sm font-semibold leading-6 border-indigo-600 border-2 text-indigo-600 shadow-sm hover:bg-indigo-600 hover:text-white'
								href="/sign-up"
							>
								Sign Up
							</a>
						</div>
					)
			}
		</div>
	)
}

export default Navbar