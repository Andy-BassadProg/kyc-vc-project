// Decodage base64url d'un JWT — port de b64url_decode() (verifier_offline_final.py)
export interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, any>;
  signingInput: Uint8Array;
  signature: Uint8Array;
}

function base64UrlToUint8Array(b64url: string): Uint8Array {
  const padLength = (4 - (b64url.length % 4)) % 4;
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(padLength);
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function base64UrlToJson(b64url: string): Record<string, any> {
  const bytes = base64UrlToUint8Array(b64url);
  return JSON.parse(new TextDecoder().decode(bytes));
}

export function decodeJwt(token: string): DecodedJwt {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Format JWT invalide");
  const [headerB64, payloadB64, signatureB64] = parts;
  return {
    header: base64UrlToJson(headerB64),
    payload: base64UrlToJson(payloadB64),
    signature: base64UrlToUint8Array(signatureB64),
    signingInput: new TextEncoder().encode(`${headerB64}.${payloadB64}`),
  };
}
