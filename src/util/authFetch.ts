import * as SecureStore from 'expo-secure-store';

import { API_URL } from '@env';
import errorToast from './errorToast';
import getErrorBody from './getErrorBody';

// This is a load bearing console.info. Apparently the
// dotenv compiler plugin doesn't work properly without it
console.info('API_URL', API_URL);

const defaultErrorHandler = async (
  response: Response,
  fallbackMessage: string,
): Promise<void> => {
  const errorBody = await getErrorBody(response);
  if (errorBody) {
    errorToast(errorBody.message);
    return;
  }
  errorToast(fallbackMessage);
};

const defaultErrorHandlers: Record<
  string,
  (response: Response) => Promise<void>
> = {
  connection: (r) => defaultErrorHandler(r, 'Could not connect to server'),
  '400': (r) => defaultErrorHandler(r, 'Request Problem'),
  '401': (r) =>
    defaultErrorHandler(
      r,
      'Unknown log in problem. Try logging out and in again.',
    ),
  '403': (r) => defaultErrorHandler(r, 'Unauthorized'),
  '404': (r) => defaultErrorHandler(r, 'Resource not found'),
  '500': (r) => defaultErrorHandler(r, 'Server Error'),
};

export default async function authFetch(
  requestInfo: RequestInfo,
  requestInit?: RequestInit,
  options?: {
    errorHandlers?: Record<string, (response: Response) => Promise<void>>;
    doNotUseDefaultErrorHandlers?: boolean;
    expectedStatus?: number;
  },
): Promise<Response> {
  const authkey = await SecureStore.getItemAsync('authkey');
  try {
    let response: Response;
    if (authkey) {
      response = await fetch(`${API_URL}${requestInfo}`, {
        ...requestInit,
        headers: {
          ...requestInit?.headers,
          Authorization: authkey,
        },
      });
    } else {
      response = await fetch(`${API_URL}${requestInfo}`, {
        ...requestInit,
        credentials: 'include',
      });
    }

    if (
      options?.errorHandlers &&
      options.errorHandlers[response.status] &&
      options.expectedStatus !== response.status
    ) {
      await options.errorHandlers[response.status](response);
    } else if (
      defaultErrorHandlers[response.status] &&
      !options?.doNotUseDefaultErrorHandlers &&
      options?.expectedStatus !== response.status
    ) {
      await defaultErrorHandlers[response.status](response);
    } else if (
      !options?.doNotUseDefaultErrorHandlers &&
      options?.expectedStatus !== response.status
    ) {
      await defaultErrorHandler(response, 'Something went wrong');
    }
    return response;
  } catch (err) {
    const response = new Response(
      JSON.stringify({ message: 'Could not connect to server', metadata: {} }),
      { status: 500 },
    );
    if (options?.errorHandlers && options.errorHandlers['connection']) {
      await options.errorHandlers['connection'](response);
    } else if (
      defaultErrorHandlers['connection'] &&
      !options?.doNotUseDefaultErrorHandlers
    ) {
      await defaultErrorHandlers['connection'](response);
    }
    return response;
  }
}
