/**
 * ChatSection
 * Seção de chat com suporte a texto e voz
 */

import { useState } from "react";
import { Mic, Square, Send, Loader2, Sparkles, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PatientInfoPopover } from "./PatientInfoPopover";
import { DeleteMessageModal } from "./DeleteMessageModal";
import type { ChatMessage, Patient, RecordingState } from "../types/consultation.types";

interface ChatSectionProps {
  patientId?: string;
  patient?: Patient | null;
  messages: ChatMessage[];
  recordingState: RecordingState;
  duration: number;
  isConsultationStarted: boolean;
  currentTranscript?: string;
  interimTranscript?: string;
  onStartConsultation: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSendMessage: (message: string) => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
  onDeleteMessage?: (messageId: string) => void;
}

export const ChatSection = ({
  patientId,
  patient,
  messages,
  recordingState,
  duration,
  isConsultationStarted,
  currentTranscript = "",
  interimTranscript = "",
  onStartConsultation,
  onStartRecording,
  onStopRecording,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
}: ChatSectionProps) => {
  const [inputText, setInputText] = useState("");

  const handleSendText = () => {
    if (inputText.trim() && patientId) {
      onSendMessage(inputText);
      setInputText("");
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Consulta</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {patientId
                ? "Digite ou grave sua consulta"
                : "Selecione ou crie um novo paciente para iniciar"}
            </p>
          </div>
          {patient && <PatientInfoPopover patient={patient} />}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {/* Botão Iniciar Consulta - Aparece quando tem paciente mas consulta não iniciada */}
        {patientId && !isConsultationStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm z-10">
            <button
              onClick={onStartConsultation}
              className="group relative flex flex-col items-center justify-center w-48 h-48 rounded-full bg-linear-to-br from-medical-500 to-medical-600 hover:from-medical-600 hover:to-medical-700 text-white shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <Sparkles className="h-12 w-12 mb-3 group-hover:animate-pulse" />
              <span className="text-lg font-semibold">Iniciar Consulta</span>
              <span className="text-xs opacity-90 mt-1">Clique para começar</span>
            </button>
          </div>
        )}

        {!patientId ? (
          <div className="flex items-center justify-center h-full px-8">
            <div className="text-center space-y-4 min-w-[300px] max-w-md">
              <div className="text-gray-400 dark:text-gray-500">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nenhum paciente selecionado
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Para iniciar uma consulta, primeiro selecione um paciente existente ou crie um
                  novo paciente usando o botão acima.
                </p>
              </div>
            </div>
          </div>
        ) : !messages || messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
            <p className="text-sm">Nenhuma mensagem ainda</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onEdit={onEditMessage}
              onDelete={onDeleteMessage}
            />
          ))
        )}
      </div>

      {/* Recording Status */}
      {recordingState !== "idle" && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {recordingState === "recording" && (
                  <>
                    <div className="h-3 w-3 rounded-full bg-critical-500 animate-pulse" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Gravando: {formatDuration(duration)}
                    </span>
                  </>
                )}
                {recordingState === "processing" && (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-medical-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Processando áudio...
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Preview da transcrição em tempo real */}
            {recordingState === "recording" && (currentTranscript || interimTranscript) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-900 dark:text-white">
                  {currentTranscript}
                  {currentTranscript && interimTranscript && " "}
                  <span className="text-gray-400 dark:text-gray-500 italic">
                    {interimTranscript}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <input
            type="text"
            name="chat-message"
            id="chat-message-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendText()}
            placeholder={
              !patientId
                ? "Selecione um paciente"
                : !isConsultationStarted
                  ? "Clique em 'Iniciar Consulta' para começar"
                  : "Digite sua mensagem..."
            }
            disabled={!patientId || !isConsultationStarted || recordingState !== "idle"}
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <Button
            onClick={handleSendText}
            disabled={
              !inputText.trim() || !patientId || !isConsultationStarted || recordingState !== "idle"
            }
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>

          <Button
            onClick={recordingState === "recording" ? onStopRecording : onStartRecording}
            disabled={!patientId || !isConsultationStarted || recordingState === "processing"}
            variant={recordingState === "recording" ? "error" : "outline"}
            size="sm"
          >
            {recordingState === "recording" ? (
              <Square className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: ChatMessage;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
}

const MessageBubble = ({ message, onEdit, onDelete }: MessageBubbleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const isUser = message.type === "user";

  const handleSaveEdit = () => {
    if (editedContent.trim() && onEdit) {
      onEdit(message.id, editedContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(message.content);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(message.id);
    }
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 relative ${
          isUser
            ? "bg-medical-500 text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        }`}
      >
        {message.isVoice && (
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1 text-xs opacity-75">
              <Mic className="h-3 w-3" />
              <span>Transcrição de voz</span>
            </div>

            {/* Botões de ação - aparecem apenas em mensagens de voz */}
            {isUser && !isEditing && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Editar transcrição"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Deletar transcrição"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full min-h-[80px] px-2 py-1 text-sm bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              autoFocus
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={handleCancelEdit}
                className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        )}

        {!isEditing && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs opacity-75">
              {message.timestamp.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {message.editedAt && <span className="text-xs opacity-60 italic">• Editado</span>}
          </div>
        )}
      </div>

      {/* Modal de confirmação de exclusão */}
      <DeleteMessageModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        messagePreview={message.content}
      />
    </div>
  );
};
