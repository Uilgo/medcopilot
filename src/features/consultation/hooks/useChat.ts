/**
 * Hook para gerenciar chat e transcrição de voz em tempo real
 * NOVO FLUXO: Mensagens ficam em estado local até finalizar consulta
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useSpeechRecognition } from "./useSpeechRecognition";
import type { ChatMessage, RecordingState } from "../types/consultation.types";

const MESSAGES_STORAGE_KEY = "active_consultation_messages";

export const useChat = (isConsultationStarted: boolean) => {
  // Inicializar mensagens do localStorage
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (!isConsultationStarted) return [];

    try {
      const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Converter timestamps de string para Date
        return parsed.map((msg: ChatMessage) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
    } catch (error) {
      console.error("Erro ao recuperar mensagens do localStorage:", error);
    }
    return [];
  });

  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [duration, setDuration] = useState(0);
  const [currentTranscript, setCurrentTranscript] = useState("");

  const timerRef = useRef<number | null>(null);

  // Salvar mensagens no localStorage sempre que mudarem
  useEffect(() => {
    if (isConsultationStarted && messages.length > 0) {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    } else if (!isConsultationStarted) {
      localStorage.removeItem(MESSAGES_STORAGE_KEY);
    }
  }, [messages, isConsultationStarted]);

  // Hook de transcrição em tempo real
  const handleTranscript = useCallback(
    async (text: string) => {
      if (!isConsultationStarted) return;

      // IMPORTANTE: Cada chamada representa uma NOVA frase finalizada
      setCurrentTranscript((prev) => {
        if (!prev) {
          // Primeira frase
          return text;
        }

        // Adicionar espaço entre frases
        return `${prev} ${text}`;
      });
    },
    [isConsultationStarted]
  );

  const {
    isListening,
    interimTranscript,
    isSupported,
    error: speechError,
    startListening: startSpeech,
    stopListening: stopSpeech,
  } = useSpeechRecognition({
    onTranscript: handleTranscript,
    language: "pt-BR",
    continuous: true,
  });

  // Limpar mensagens quando consulta não estiver iniciada
  useEffect(() => {
    if (!isConsultationStarted && messages.length > 0) {
      setMessages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConsultationStarted]);

  // Sincronizar estado de gravação com Web Speech API
  useEffect(() => {
    if (isListening && recordingState !== "recording") {
      setRecordingState("recording");
    } else if (!isListening && recordingState === "recording") {
      setRecordingState("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  // Timer para gravação
  useEffect(() => {
    if (recordingState === "recording") {
      timerRef.current = window.setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (duration > 0) {
        setDuration(0);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordingState]);

  const startRecording = () => {
    if (!isSupported) {
      alert("Seu navegador não suporta gravação de voz. Use Chrome, Edge ou Opera.");
      return;
    }

    if (!isConsultationStarted) {
      alert("Inicie a consulta antes de gravar");
      return;
    }

    startSpeech();
    setCurrentTranscript("");
  };

  const stopRecording = () => {
    stopSpeech();

    // Adicionar o transcript acumulado como mensagem local
    if (currentTranscript.trim()) {
      const newMessage: ChatMessage = {
        id: `local-${Date.now()}`,
        type: "user",
        content: currentTranscript.trim(),
        timestamp: new Date(),
        isVoice: true,
      };
      setMessages((prev) => [...prev, newMessage]);
      setCurrentTranscript("");
    }
  };

  const sendTextMessage = (content: string) => {
    if (!isConsultationStarted) {
      alert("Inicie a consulta antes de enviar mensagens");
      return;
    }

    const newMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      type: "user",
      content,
      timestamp: new Date(),
      isVoice: false,
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  const editMessage = (messageId: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              content: newContent,
              editedAt: new Date().toISOString(),
              editCount: (msg.editCount || 0) + 1,
            }
          : msg
      )
    );
  };

  const deleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const resetChat = () => {
    setMessages([]);
    setRecordingState("idle");
    setDuration(0);
    localStorage.removeItem(MESSAGES_STORAGE_KEY);
  };

  return {
    messages,
    recordingState,
    duration,
    currentTranscript,
    interimTranscript,
    isSupported: isSupported,
    speechError,
    startRecording,
    stopRecording,
    sendTextMessage,
    editMessage,
    deleteMessage,
    resetChat,
  };
};
