/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Backend
  readonly VITE_API_URL: string;
  readonly VITE_API_TIMEOUT: string;

  // Supabase
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;

  // Feature Flags
  readonly VITE_ENABLE_AUDIO_RECORDING: string;
  readonly VITE_ENABLE_VIDEO_CALLS: string;
  readonly VITE_ENABLE_CHAT: string;

  // Ambiente
  readonly VITE_APP_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
