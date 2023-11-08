import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import { loadStorage } from '../utils/persistLocalStorage';

function AuthLayout() {
	const token = loadStorage('token');
	const navigate = useNavigate();

	useEffect(() => {
		/*
		 * If token is present, redirect to home page
		*/
		if (token) {
			navigate("/");
		}
	}, [token]);

	return (
		<div>
			<Outlet />
		</div>
	)
}

export default AuthLayout