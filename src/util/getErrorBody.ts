export interface IErrorBody {
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;
}

export default async function getErrorBody(
  response: Response,
): Promise<IErrorBody | null> {
  try {
    const body = await response.json();
    if (
      typeof body.message !== 'string' ||
      !body.metadata ||
      typeof body.metadata !== 'object'
    ) {
      return null;
    }
    return body;
  } catch {
    return null;
  }
}
