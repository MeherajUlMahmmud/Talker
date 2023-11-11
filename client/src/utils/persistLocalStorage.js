export const loadStorage = (value) => {
	try {
		const serializedState = window.localStorage.getItem(value);

		if (
			!serializedState ||
			serializedState === null ||
			serializedState === undefined
		) {
			return undefined;
		}

		return JSON.parse(serializedState);
	} catch (err) {
		console.log(`localStorage value not found!`);
		return undefined;
	}
};

export const saveStorage = (name, value) => {
	console.log(name, JSON.stringify(value));
	try {
		const serializedState = JSON.stringify(value);
		window.localStorage.setItem(name, serializedState);
	} catch (err) {
		console.log(err);
	}
};

export const delStorage = (value) => {
	try {
		window.localStorage.removeItem(value);
	} catch (err) {
		console.log(err);
	}
};