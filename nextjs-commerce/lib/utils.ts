import { ReadonlyURLSearchParams } from 'next/navigation';

export const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export function createUrl(pathname: string, params: URLSearchParams | undefined) {
  const paramsString = params?.toString();
  const queryString = `${paramsString?.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
}

export function ensureStartsWith(stringToCheck: string, startsWith: string) {
  if (!stringToCheck || typeof stringToCheck !== 'string') {
    return stringToCheck;
  }

  if (stringToCheck.startsWith(startsWith)) {
    return stringToCheck;
  }

  return `${startsWith}${stringToCheck}`;
}

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET'
  ];

  const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvironmentVariables.length > 0) {
    throw new Error(
      `Please check your .env file. Missing required environment variables:\n${missingEnvironmentVariables.join(
        '\n'
      )}`
    );
  }
};
