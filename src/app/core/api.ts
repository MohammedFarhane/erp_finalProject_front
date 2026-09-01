import { environment } from '../../environments/environment';

export const API_URL = environment.apiUrl;

// Seule route publique : les deux intercepteurs s'en servent pour l'exclure.
export const LOGIN_URL = `${API_URL}/auth/login`;
