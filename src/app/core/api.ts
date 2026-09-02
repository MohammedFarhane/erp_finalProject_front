import { environment } from '../../environments/environment';
import { HttpResponse } from '@angular/common/http';

export const API_URL = environment.apiUrl;

// seule route publique : les deux intercepteurs s'en servent pour l'exclure.
export const LOGIN_URL = `${API_URL}/auth/login`;

// Les POST de création renvoient un corps vide : l'identifiant est dans
// l'en-tête Location (`/quote/7`), que le back expose exprès au CORS.
export function idFromLocation(response: HttpResponse<unknown>): number {
  const location = response.headers.get('Location');
  const id = Number(location?.split('/').pop());

  if (!location || Number.isNaN(id)) {
    throw new Error("L'en-tête Location est absent ou illisible.");
  }
  return id;
}
