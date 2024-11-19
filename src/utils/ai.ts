/* eslint-disable no-restricted-globals */
/// <reference types="user-agent-data-types" />

export namespace ChromeAI {
  export enum AICapability {
    UNSUPPORTED, // AI is not supported in this browser
    NONE, // AI is supported but models are now unavailable
    DOWNLOAD, // AI is supported but models need to be downloaded
    READY, // AI is supported and models are ready
  }
  export class Client {
    private static instance: Client;

    private constructor() {}

    public static async getInstance() {
      if (!Client.instance) {
        Client.instance = new Client();
      }

      return Client.instance;
    }

    public async summarize(
      text: string,
      type?: AISummarizerType,
      format?: AISummarizerFormat,
      length?: AISummarizerLength,
      signal?: AbortSignal
    ) {
      try {
        await this.checkCapabilities();
        const summarizer = await self.ai.summarizer.create({ type, format, length });
        const summary = await summarizer.summarize(text, { signal });
        summarizer.destroy();
        return summary;
      } catch (e) {
        console.error('Failed to summarize:', e);
        throw e;
      }
    }

    public async promptAtOnce(text: string, signal?: AbortSignal) {
      try {
        await this.checkCapabilities();
        const session = await self.ai.languageModel.create();
        const result = await session.prompt(text, { signal });
        session.destroy();
        return result;
      } catch (e) {
        console.error('Failed to prompt:', e);
        throw e;
      }
    }

    public async promptByStream(text: string, signal?: AbortSignal) {
      try {
        await this.checkCapabilities();
        const session = await self.ai.languageModel.create();
        const stream = session.promptStreaming(text, { signal });

        // Destroy the session when the stream is closed
        stream.getReader().closed.then(() => {
          session.destroy();
        });

        return stream;
      } catch (e) {
        console.error('Failed to prompt:', e);
        throw e;
      }
    }

    public async getCapabilities() {
      if (!this.isBrowserSupported()) return AICapability.UNSUPPORTED;

      try {
        const summarizerCapa = await self.ai.summarizer.capabilities();
        const promptCapa = await self.ai.languageModel.capabilities();

        if (summarizerCapa.available === 'no' || promptCapa.available === 'no') return AICapability.NONE;
        if (summarizerCapa.available === 'after-download' || promptCapa.available === 'after-download')
          return AICapability.DOWNLOAD;
        if (summarizerCapa.available === 'readily' && promptCapa.available === 'readily') return AICapability.READY;
      } catch (e) {
        return AICapability.UNSUPPORTED;
      }

      return AICapability.UNSUPPORTED;
    }

    public async downloadModels() {
      try {
        // Use create() to trigger download
        const summarizer = await self.ai.summarizer.create({
          monitor: (m) => {
            m.ondownloadprogress = (ev) => {
              console.log('Downloading Summarizer AI models:', ev.loaded, ev.total);
            };
          },
        });
        const session = await self.ai.languageModel.create({
          monitor: (m) => {
            m.ondownloadprogress = (ev) => {
              console.log('Downloading Prompt AI models:', ev.loaded, ev.total);
            };
          },
        });

        // Destroy the clients after download
        summarizer.destroy();
        session.destroy();

        return true;
      } catch (e) {
        console.error('Failed to download AI models:', e);
        return false;
      }
    }

    private async checkCapabilities() {
      const capabilities = await this.getCapabilities();

      if (capabilities === AICapability.UNSUPPORTED) {
        throw new Error('AI is not supported in this browser');
      }

      if (capabilities === AICapability.NONE) {
        throw new Error('AI models are not available');
      }

      if (capabilities === AICapability.DOWNLOAD) {
        throw new Error('AI models need to be downloaded');
      }
    }

    private isBrowserSupported() {
      // check if user agent is Chrome 127+
      const uaBrand = navigator.userAgentData?.brands ?? [];
      const chromeBrandData = uaBrand.find((brand) => brand.brand === 'Google Chrome');

      if (!chromeBrandData) return false;
      if (!parseInt(chromeBrandData.version) && parseInt(chromeBrandData.version) < 127) return false;
      return true;
    }
  }
}
