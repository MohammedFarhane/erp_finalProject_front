export interface Page<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface ProblemDetail {
  status: number;
  title: string;
  detail: string;
  errors?: Record<string, string>;
}

export function emptyPage<T>(): Page<T> {
  return { content: [], page: { size: 0, number: 0, totalElements: 0, totalPages: 0 } };
}
