import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

import { Request } from 'express';
import { corsNotAllowed, getOrigin, getPath } from '@/helpers/request.helper';
import { CorsConfig } from './cors.config';

export const corsOptionsDelegate =
  (corsConfig: typeof CorsConfig) =>
  (req: Request, callback: (err: Error, options: CorsOptions) => void) => {
    const corsOptions: CorsOptions = {
      methods: corsConfig.allowedMethods,
      credentials: corsConfig.allowedCredentials,
      origin: false,
    };
    let error: Error | null = null;

    const origin = getOrigin(req);
    const url = getPath(req);

    if (
      !origin ||
      !corsConfig.allowedOrigins.length ||
      corsConfig.allowedOrigins.indexOf(origin) !== -1
    ) {
      corsOptions.origin = true;
      error = null;
    } else if (
      corsConfig.allowedUrls.length &&
      corsConfig.allowedUrls.indexOf(url) !== -1
    ) {
      corsOptions.origin = true;
      error = null;
    } else {
      corsOptions.origin = false;
      error = corsNotAllowed({ raise: false });
    }

    callback(error, corsOptions);
  };
