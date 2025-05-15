import { verifyToken } from '@clerk/backend';
import type { Team, User } from '@prisma/client';
import type { TsRestRequest } from '@ts-rest/serverless';

import { AppError, AppErrorCode } from '@documenso/lib/errors/app-error';
import { getApiTokenByToken } from '@documenso/lib/server-only/public-api/get-api-token-by-token';
import { getUserByEmail } from '@documenso/lib/server-only/public-api/get-user-by-email';
import type { ApiRequestMetadata } from '@documenso/lib/universal/extract-request-metadata';
import { extractRequestMetadata } from '@documenso/lib/universal/extract-request-metadata';

type B = {
  // appRoute: any;
  request: TsRestRequest;
  responseHeaders: Headers;
};

export const authenticatedMiddleware = <
  T extends {
    headers: {
      authorization: string;
    };
  },
  R extends {
    status: number;
    body: unknown;
  },
>(
  handler: (
    args: T & { req: TsRestRequest },
    user: User,
    team: Team | null | undefined,
    options: { metadata: ApiRequestMetadata },
  ) => Promise<R>,
) => {
  return async (args: T, { request }: B) => {
    try {
      const { authorization } = args.headers;

      // Support for both "Authorization: Bearer api_xxx" and "Authorization: api_xxx"
      const [token] = (authorization || '').split('Bearer ').filter((s) => s.length > 0);

      if (!token) {
        throw new AppError(AppErrorCode.UNAUTHORIZED, {
          message: 'API token was not provided',
        });
      }

      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      // if our token is not a Clerk token, we fallback to API key
      if (!payload) {
        console.log('Invalid Clerk token or not a Clerk token, falling back to API key');

        const apiToken = await getApiTokenByToken({ token });

        if (apiToken.user.disabled) {
          throw new AppError(AppErrorCode.UNAUTHORIZED, {
            message: 'User is disabled',
          });
        }

        const metadata: ApiRequestMetadata = {
          requestMetadata: extractRequestMetadata(request),
          source: 'apiV1',
          auth: 'api',
          auditUser: {
            id: apiToken.team ? null : apiToken.user.id,
            email: apiToken.team ? null : apiToken.user.email,
            name: apiToken.team?.name ?? apiToken.user.name,
          },
        };

        return await handler(
          {
            ...args,
            req: request,
          },
          apiToken.user,
          apiToken.team,
          { metadata },
        );
      } else {
        // if the token is a Clerk token, we need to get the user by email
        // since the token is verified, we can be sure this request is authenticated
        if (!payload.email || !(typeof payload.email === 'string')) {
          throw new AppError(AppErrorCode.UNAUTHORIZED, {
            message: 'User email was not provided',
          });
        }

        const user = await getUserByEmail({ email: payload.email });

        if (!user) {
          throw new AppError(AppErrorCode.UNAUTHORIZED, {
            message: 'User was not found',
          });
        }

        const team = user.ownedTeams[0];

        if (user.disabled) {
          throw new AppError(AppErrorCode.UNAUTHORIZED, {
            message: 'User is disabled',
          });
        }

        // map the data to match the expected format
        const metadata: ApiRequestMetadata = {
          requestMetadata: extractRequestMetadata(request),
          source: 'apiV1',
          auth: 'api',
          auditUser: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        };

        return await handler(
          {
            ...args,
            req: request,
          },
          user,
          team,
          { metadata },
        );
      }
    } catch (err) {
      console.log({ err: err });

      let message = 'Unauthorized';

      if (err instanceof AppError) {
        message = err.message;
      }

      return {
        status: 401,
        body: {
          message,
        },
      } as const;
    }
  };
};
