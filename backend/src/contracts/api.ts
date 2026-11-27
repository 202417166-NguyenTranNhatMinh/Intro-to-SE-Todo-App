export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data: T | null;
}

export interface ValidationFieldError {
  field: string;
  message: string;
}
