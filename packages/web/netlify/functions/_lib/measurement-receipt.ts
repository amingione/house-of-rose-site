import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export interface LeadMeasurementPayload {
  version: 1;
  leadId: string;
  nonce: string;
  expiresAt: number;
}

const encode = (value: string): string => Buffer.from(value, 'utf8').toString('base64url');
const decode = (value: string): string => Buffer.from(value, 'base64url').toString('utf8');

const signature = (encodedPayload: string, secret: string): string =>
  createHmac('sha256', secret).update(encodedPayload).digest('base64url');

export const hashMeasurementReceipt = (receipt: string): string =>
  createHash('sha256').update(receipt).digest('hex');

export const createLeadMeasurementReceipt = (
  payload: LeadMeasurementPayload,
  secret: string,
): string => {
  const encodedPayload = encode(JSON.stringify(payload));
  return `${encodedPayload}.${signature(encodedPayload, secret)}`;
};

export const verifyLeadMeasurementReceipt = (
  receipt: string,
  secret: string,
): LeadMeasurementPayload | null => {
  const [encodedPayload, suppliedSignature] = receipt.split('.');
  if (!encodedPayload || !suppliedSignature) return null;
  const expected = signature(encodedPayload, secret);
  const suppliedBuffer = Buffer.from(suppliedSignature);
  const expectedBuffer = Buffer.from(expected);
  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) {
    return null;
  }
  try {
    const parsed = JSON.parse(decode(encodedPayload)) as Partial<LeadMeasurementPayload>;
    if (
      parsed.version !== 1 ||
      typeof parsed.leadId !== 'string' ||
      typeof parsed.nonce !== 'string' ||
      typeof parsed.expiresAt !== 'number' ||
      parsed.expiresAt <= Date.now()
    ) {
      return null;
    }
    return parsed as LeadMeasurementPayload;
  } catch {
    return null;
  }
};
