// Verification de signature ES256 (secp256r1) cote navigateur via WebCrypto.
// Equivalent de la partie verification de verifier_offline_final.py, mais sans
// conversion DER : WebCrypto attend directement le format brut r||s (comme un JWT).
export async function verifyJwtSignature(
  jwk: JsonWebKey,
  signingInput: Uint8Array,
  signature: Uint8Array
): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      "jwk",
      { ...jwk, ext: true, key_ops: ["verify"] } as JsonWebKey,
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["verify"]
    );
    return await crypto.subtle.verify(
      { name: "ECDSA", hash: "SHA-256" },
      key,
      signature as BufferSource,
      signingInput as BufferSource
    );
  } catch (err) {
    console.error("Échec de la vérification de signature", err);
    return false;
  }
}

export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
