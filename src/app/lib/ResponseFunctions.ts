export function Ok(payload: any) {
  return {
    status: 'ok',
    payload,
  };
}

export function Failure(errorMessage) {
  return {
    status: 'error',
    errorMessage,
  };
}
