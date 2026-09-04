import { inject, Signal } from '@angular/core';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { API_URL, cleanParams, idFromLocation } from './api';
import { emptyPage, Page } from './models/page';
import { map, Observable } from 'rxjs';

export type QueryParams = Record<string, string | number | undefined>;

export abstract class CrudService<T, TRequest> {
  protected readonly http = inject(HttpClient);

  protected constructor(protected readonly path: string) {}

  protected url(id?: number): string {
    return id === undefined ? `${API_URL}/${this.path}`
      : `${API_URL}/${this.path}/${id}`;
  }

  search(params: Signal<QueryParams>): HttpResourceRef<Page<T>> {
    return httpResource<Page<T>>(() => ({ url: this.url(), params:
          cleanParams(params())}),
      { defaultValue: emptyPage<T>(),
      });
  }

  getById(id: Signal<number>): HttpResourceRef<T | undefined>  {
    return httpResource<T | undefined>(() => this.url(id()));
  }

  create(request: TRequest): Observable<number> {
    return this.http.post(this.url(), request, { observe: 'response'})
      .pipe(map(idFromLocation));
  }

  update(id: number, request: TRequest): Observable<void> {
    return this.http.put<void>(this.url(id), request);
  }

  archive(id: number): Observable<void> {
    return this.http.delete<void>(this.url(id));
  }
}
