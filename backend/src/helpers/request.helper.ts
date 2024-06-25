import { HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

interface IErrData {
  msg?: string;
  raise?: boolean;
}

export function getIp(req: Request): string {
  return req.ip || (req.connection && req.connection.remoteAddress) || '-';
}

export function getForwardedIp(req: Request): string {
  let ips = req.get('X-Forwarded-For');

  if (ips?.length) {
    ips = ips.split(', ')[0];
  }

  return ips || '-';
}

export function getUrl(req: Request): string {
  return req.originalUrl || req.url || req.baseUrl || '-';
}

export function getPath(req: Request): string {
  return getUrl(req).split('?')[0];
}

export function getAction(req: Request): string {
  return getUrl(req).split('/')[1];
}

export function getHttpVersion(req: Request): string {
  return req.httpVersionMajor + '.' + req.httpVersionMinor;
}

export function getResponseHeader(res: Response, field: string) {
  if (!res.headersSent) {
    return undefined;
  }

  const header = res.getHeader(field);

  return Array.isArray(header) ? header.join(', ') : header || '-';
}

export function getReferrer(req: Request) {
  const referer = req.headers.referer || req.headers.referrer || '-';

  if (typeof referer === 'string') {
    return referer;
  }

  return referer[0];
}

export function getOrigin(req: Request) {
  const origin = req.headers.origin;

  if (!origin || typeof origin === 'string') {
    return origin as string;
  }

  return origin[0];
}

export function getMethod(req: Request) {
  return req.method;
}

export function getUserAgent(req: Request) {
  return req.headers['user-agent'] || '-';
}

export const corsNotAllowed = (data?: IErrData) => {
  const err = new HttpException(
    {
      status: 400,
      error: data?.msg || 'CORS_NOT_ALLOWED',
    },
    400,
  );

  if (data?.raise) {
    throw err;
  }

  return err;
};

export function toVietnamTimezone(date: Date): Date {
  return new Date(date.getTime() + 7 * 60 * 60 * 1000); // UTC+7
}
