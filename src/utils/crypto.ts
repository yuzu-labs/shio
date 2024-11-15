import { RSA_PUBLIC_KEY } from './config';

export class RSAEncryptionClient {
  private static instance: RSAEncryptionClient | null = null;
  private publicKey: CryptoKey | null = null;

  private constructor() {}

  public static async getInstance(): Promise<RSAEncryptionClient> {
    if (!RSAEncryptionClient.instance) {
      RSAEncryptionClient.instance = new RSAEncryptionClient();
      await RSAEncryptionClient.instance.loadPublicKey();
    }
    return RSAEncryptionClient.instance;
  }

  private async loadPublicKey() {
    if (!RSA_PUBLIC_KEY) {
      throw new Error('RSA public key not found');
    }
    const keyBuffer = new Uint8Array(
      atob(RSA_PUBLIC_KEY)
        .split('')
        .map((c) => c.charCodeAt(0))
    );

    this.publicKey = await window.crypto.subtle.importKey(
      'spki',
      keyBuffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      false,
      ['encrypt']
    );
  }

  public async encrypt(data: string): Promise<string> {
    if (!this.publicKey) {
      throw new Error('Public key not loaded');
    }

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      this.publicKey,
      dataBuffer
    );

    return btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
  }
}
