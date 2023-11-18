import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendAuthRequest } from '../../apis/api';
import { loadStorage, saveStorage } from '../../utils/persistLocalStorage';
import { LOGIN_URL } from '../../utils/urls';
import './auth.scss';

function LoginPage() {
	const navigate = useNavigate();

	const [inputs, setInputs] = useState({
		username: "",
		password: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e) => {
		/*
		 * Update input state with the current value
		*/
		setInputs({ ...inputs, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		/*
		 * Handle user login
		 * Send a POST request to the server with the login credentials
		 * If successful, save the token in local storage and redirect to home page
		 * If unsuccessful, display the error message
		*/
		e.preventDefault();

		setError("");
		setIsLoading(true);

		sendAuthRequest(LOGIN_URL, inputs)
			.then((res) => {
				console.log(res);
				saveStorage("token", res.data.token);
				saveStorage("user", res.data.user);
				setIsLoading(false);
				navigate("/");
			})
			.catch((err) => {
				console.log(err);
				setError(err?.response?.data?.error || "Something went wrong");
				setIsLoading(false);
			});
	};

	return (
		<div className='auth_wrapper'>
			<div className="form_wrapper">
				<div className="form_header">
					<p className='header1'>Welcome back!</p>
					<p className='header2'>
						We're so excited to see you again!
					</p>
				</div>

				<form className="auth_form" onSubmit={handleSubmit} method="POST">
					<div className="form_group">
						<label for="username" className="form_label">
							USERNAME
						</label>
						<input
							id="username"
							name="username"
							type="text"
							autocomplete="username"
							onChange={(e) => handleChange(e)}
							required
							className="form_input" />
					</div>
					<div className="form_group">
						<label for="password" className="form_label">
							PASSWORD
						</label>
						<input
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							onChange={(e) => handleChange(e)}
							required
							className="form_input" />
					</div>

					{
						error && (
							<div className="auth_error">
								{error}
							</div>
						)
					}

					<button
						type="submit"
						disabled={isLoading}
						className="form_button"
					>
						Log in
					</button>

					<p className="auth_account_label">
						Don't have an account?
						<a href="/auth/sign-up" className="auth_link"> Sign Up</a>
					</p>
				</form>
			</div>
		</div>
	)
}

export default LoginPage