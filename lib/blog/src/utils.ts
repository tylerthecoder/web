export type SucessResult<T> = {
  data: T;
};

export type ErrorResult = {
  error: Error;
};

export type Result<T> = SucessResult<T> | ErrorResult;

export function Ok<T>(data: T): SucessResult<T> {
  return { data };
}

export function Err(error: Error): ErrorResult {
  return { error };
}

export function isErr(result: Result<any>): result is ErrorResult {
  return "error" in result;
}
