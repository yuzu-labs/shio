import { AES_KEY, RSA_PUBLIC_KEY } from './config';

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

export class AESClient {
  private static instance: AESClient | null = null;
  private key: CryptoKey | null = null;

  private constructor() {}

  public static async getInstance(): Promise<AESClient> {
    if (!AESClient.instance) {
      AESClient.instance = new AESClient();
      await AESClient.instance.importKey();
    }
    return AESClient.instance;
  }

  async importKey(): Promise<void> {
    if (!AES_KEY) {
      throw new Error('AES key not found');
    }

    const rawKey = Uint8Array.from(atob(AES_KEY), (c) => c.charCodeAt(0));
    this.key = await window.crypto.subtle.importKey(
      'raw',
      rawKey,
      {
        name: 'AES-GCM',
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  async encrypt(data: string): Promise<string> {
    if (!this.key) {
      throw new Error('Key is not loaded');
    }

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      this.key,
      encodedData
    );

    const ivStr = btoa(String.fromCharCode(...iv));
    const encryptedStr = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
    return `${ivStr}:${encryptedStr}`;
  }

  async decrypt(encryptedData: string): Promise<string> {
    if (!this.key) {
      throw new Error('Key is not loaded');
    }

    const [ivStr, encryptedStr] = encryptedData.split(':');
    const iv = new Uint8Array(
      atob(ivStr)
        .split('')
        .map((char) => char.charCodeAt(0))
    );
    const encryptedBuffer = new Uint8Array(
      atob(encryptedStr)
        .split('')
        .map((char) => char.charCodeAt(0))
    );

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      this.key,
      encryptedBuffer
    );

    return new TextDecoder().decode(decryptedBuffer);
  }
}
