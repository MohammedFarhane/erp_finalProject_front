import { environment } from '../../environments/environment';
import { httpResource, HttpResourceRef, HttpResponse } from '@angular/common/http';
import { emptyPage, Page } from './models/page';

const LIST_ALL_SIZE = 100;
export const PAGE_SIZE = 10;

export const API_URL = environment.apiUrl;

// seule route publique : les deux intercepteurs s'en servent pour l'exclure.
export const LOGIN_URL = `${API_URL}/auth/login`;

//Permet d'extraire l'id de l'en-tête location que le back expose au CORS (/quote/7)
export function idFromLocation(response: HttpResponse<unknown>): number {
  const id = Number(response.headers.get('Location')?.split('/').pop());
  if (Number.isNaN(id) || id <= 0) {
    throw new Error("L'en-tête Location est absent ou illisible.");
  }
  return id;
}

// Liste complète d'une ressource, pour remplir un sélecteur.
export function listAllResource<T>(path: string): HttpResourceRef<Page<T>> {
  return httpResource<Page<T>>(
    () => ({ url: `${API_URL}/${path}`, params: { page: 0, size: LIST_ALL_SIZE } }),
    { defaultValue: emptyPage<T>() },
  );
}

// Un filtre vide ne doit pas partir : `state=` ferait échouer la conversion
// vers l'énumération côté Spring, et le back répondrait 400.
export function cleanParams(
  params: Record<string, string | number | undefined>,
): Record<string, string | number> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ''),
  ) as Record<string, string | number>;
}
