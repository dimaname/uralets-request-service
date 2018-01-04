export const checkUserAuth = (user) => {
	return user.token !== null && user.token !== undefined && user.token !== '';
}