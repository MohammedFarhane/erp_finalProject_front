import { environment } from '../../environments/environment';

export const API_URL = environment.apiUrl;

// seule route publique : les deux intercepteurs s'en servent pour l'exclure.
export const LOGIN_URL = `${API_URL}/auth/login`;
