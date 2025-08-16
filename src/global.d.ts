declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENNOTE_API_KEY?: string;
    }
  }

  var process: {
    env: NodeJS.ProcessEnv;
  } | undefined;

  interface Window {
    OPENNOTE_API_KEY?: string;
  }
}

export {};