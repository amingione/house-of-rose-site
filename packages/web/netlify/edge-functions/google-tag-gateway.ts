import type { Config, Context } from '@netlify/edge-functions';

export const GOOGLE_TAG_MANAGER_CONTAINER_ID = 'GTM-NSDKJFP9' as const;
export const GOOGLE_TAG_GATEWAY_ORIGIN = 'https://gtm-nsdkjfp9.fps.goog' as const;
export const GOOGLE_TAG_GATEWAY_PATH = '/metrics/' as const;

interface GatewayContext {
  geo: Pick<Context['geo'], 'country' | 'subdivision'>;
}

interface GatewayDependencies {
  containerId?: string;
  fetcher?: typeof fetch;
}

const unavailable = (status: 502 | 503): Response =>
  new Response('Google tag gateway is unavailable.', {
    status,
    headers: {
      'cache-control': 'no-store',
      'content-type': 'text/plain; charset=utf-8',
    },
  });

const normalizedRegion = (country: string, region: string): string => {
  const upperRegion = region.toUpperCase();
  const prefix = `${country}-`;
  return upperRegion.startsWith(prefix) ? upperRegion.slice(prefix.length) : upperRegion;
};

export const forwardGoogleTagGatewayRequest = async (
  request: Request,
  context: GatewayContext,
  dependencies: GatewayDependencies = {},
): Promise<Response> => {
  const containerId = dependencies.containerId;
  if (containerId !== GOOGLE_TAG_MANAGER_CONTAINER_ID) return unavailable(503);

  const incomingUrl = new URL(request.url);
  const upstreamUrl = new URL(`${incomingUrl.pathname}${incomingUrl.search}`, GOOGLE_TAG_GATEWAY_ORIGIN);
  const upstreamRequest = new Request(upstreamUrl, request);
  const country = context.geo.country?.code?.toUpperCase();
  const region = context.geo.subdivision?.code;

  upstreamRequest.headers.delete('host');

  if (country) {
    upstreamRequest.headers.set('x-forwarded-country', country);
  }
  if (country && region) {
    upstreamRequest.headers.set('x-forwarded-region', normalizedRegion(country, region));
  }

  try {
    return await (dependencies.fetcher ?? fetch)(upstreamRequest);
  } catch {
    return unavailable(502);
  }
};

export default (request: Request, context: Context): Promise<Response> =>
  forwardGoogleTagGatewayRequest(request, context, {
    containerId: Netlify.env.get('PUBLIC_GTM_ID'),
  });

export const config: Config = {
  path: ['/metrics', '/metrics/*'],
};
