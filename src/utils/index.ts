export function parseJwt<T>(token: string){
	try {
	  return JSON.parse(atob(token.split('.')[1])) as T;
	} catch (e) {
	  return null;
	}
};
  