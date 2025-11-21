/**
 * Hook para transcrição de voz em tempo real usando Web Speech API
 * 100% gratuito e funciona no navegador
 */

import { useState, useEffect, useRef, useCallback } from "react";

interface UseSpeechRecognitionProps {
  onTranscript: (text: string, pauseDuration?: number) => void;
  language?: string;
  continuous?: boolean;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

export const useSpeechRecognition = ({
  onTranscript,
  language = "pt-BR",
  continuous = true,
}: UseSpeechRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<unknown>(null);
  const lastFinalTranscriptRef = useRef<string>(""); // Evitar duplicatas
  const lastSpeechTimeRef = useRef<number>(0); // Detectar pausas

  // Verificar suporte do navegador
  const isSupported = "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    // Criar instância do reconhecimento de voz
    const SpeechRecognition =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    const recognition = new (SpeechRecognition as new () => unknown)();

    // Configurações
    (recognition as Record<string, unknown>).lang = language;
    (recognition as Record<string, unknown>).continuous = continuous;
    (recognition as Record<string, unknown>).interimResults = true; // Mantém true para preview
    (recognition as Record<string, unknown>).maxAlternatives = 1;

    // Configurações adicionais para melhorar precisão
    // Aguardar mais tempo antes de considerar que a fala terminou
    (recognition as Record<string, unknown>).speechTimeout = 2000; // 2 segundos de silêncio

    // Evento: Resultado da transcrição
    (recognition as Record<string, unknown>).onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";

      // Processar apenas os resultados NOVOS (a partir do resultIndex)
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          // Texto final (confirmado) - apenas este será enviado
          final += transcript;
        } else {
          // Texto temporário (enquanto fala) - apenas para preview
          interim += transcript;
        }
      }

      // Atualizar preview em tempo real (apenas para visualização)
      if (interim) {
        setInterimTranscript(interim);
      }

      // Enviar APENAS texto final confirmado e evitar duplicatas
      if (final.trim() && final.trim() !== lastFinalTranscriptRef.current) {
        // Calcular duração da pausa desde a última fala
        const now = Date.now();
        const pauseDuration = now - lastSpeechTimeRef.current;
        lastSpeechTimeRef.current = now;

        lastFinalTranscriptRef.current = final.trim();
        onTranscript(final.trim(), pauseDuration);
        setInterimTranscript(""); // Limpar preview após enviar
      }
    };

    // Evento: Erro
    (recognition as Record<string, unknown>).onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Erro na transcrição:", event.error);

      // Mensagens de erro amigáveis
      const errorMessages: Record<string, string> = {
        "no-speech": "Nenhuma fala detectada. Tente novamente.",
        "audio-capture": "Microfone não encontrado ou sem permissão.",
        "not-allowed": "Permissão de microfone negada.",
        network: "Erro de rede. Verifique sua conexão.",
      };

      setError(errorMessages[event.error] || "Erro ao gravar áudio.");
      setIsListening(false);
    };

    // Evento: Início
    (recognition as Record<string, unknown>).onstart = () => {
      setIsListening(true);
      setError(null);
      lastFinalTranscriptRef.current = ""; // Reset ao iniciar nova gravação
      lastSpeechTimeRef.current = Date.now(); // Reset timer de pausas
    };

    // Evento: Fim
    (recognition as Record<string, unknown>).onend = () => {
      setIsListening(false);
      setInterimTranscript("");
      lastFinalTranscriptRef.current = ""; // Reset ao finalizar
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          (recognitionRef.current as Record<string, () => void>).stop();
        } catch {
          // Ignorar erro se já estiver parado
        }
      }
    };
  }, [language, continuous, onTranscript, isSupported]);

  // Iniciar gravação
  const startListening = useCallback(() => {
    if (!isSupported) {
      setError("Seu navegador não suporta gravação de voz. Use Chrome, Edge ou Opera.");
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        (recognitionRef.current as Record<string, () => void>).start();
        setError(null);
      } catch {
        console.error("Erro ao iniciar gravação");
        setError("Erro ao iniciar gravação. Tente novamente.");
      }
    }
  }, [isListening, isSupported]);

  // Parar gravação
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        (recognitionRef.current as Record<string, () => void>).stop();
      } catch {
        console.error("Erro ao parar gravação");
      }
    }
  }, [isListening]);

  return {
    isListening,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
  };
};
