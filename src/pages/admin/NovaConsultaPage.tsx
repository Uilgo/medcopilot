/**
 * NovaConsultaPage
 * Página de captura de consulta com IA (Copilot)
 */

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { usePageStore } from "@/store/usePageStore";
import { PatientSelector } from "@/features/consultation/components/PatientSelector";
import { NewPatientModal } from "@/features/consultation/components/NewPatientModal";
import { CancelConsultationModal } from "@/features/consultation/components/CancelConsultationModal";
import { ChatSection } from "@/features/consultation/components/ChatSection";
import { AIAnalysisPanel } from "@/features/consultation/components/AIAnalysisPanel";
import { usePatientSelection } from "@/features/consultation/hooks/usePatientSelection";
import { usePatientData } from "@/features/consultation/hooks/usePatientData";
import { useConsultation } from "@/features/consultation/hooks/useConsultation";
import { useChat } from "@/features/consultation/hooks/useChat";
import { useAIAnalysis } from "@/features/consultation/hooks/useAIAnalysis";
import type { Patient } from "@/features/consultation/types/consultation.types";

export const NovaConsultaPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { setPageInfo } = usePageStore();

  // Definir título e descrição da página
  useEffect(() => {
    setPageInfo("Nova Consulta", "Capture e transcreva consultas em tempo real com IA");
  }, [setPageInfo]);

  // Hooks de gerenciamento de estado
  const {
    patients,
    selectedPatient,
    isLoading: isLoadingPatients,
    selectPatient,
    addNewPatient,
  } = usePatientSelection();

  // Usar selectedPatient diretamente, pois já tem todos os dados
  // Mas também buscar dados atualizados se necessário
  const { patient: patientData } = usePatientData(selectedPatient?.id);

  // Usar patientData se disponível, senão usar selectedPatient
  const currentPatient = patientData || selectedPatient;

  // Hook de consulta (agora só salva ao finalizar)
  const {
    isConsultationStarted,
    isSaving,
    startConsultation,
    finishConsultation,
    clearConsultation,
  } = useConsultation(selectedPatient?.id);

  // Função para iniciar consulta localmente
  const handleStartConsultation = () => {
    if (selectedPatient?.id) {
      const result = startConsultation(selectedPatient.id, "Consulta iniciada");
      if (result) {
        toast.success("Consulta iniciada! As informações serão salvas ao finalizar.");
      }
    } else {
      toast.warning("Selecione um paciente para iniciar");
    }
  };

  const {
    messages,
    recordingState,
    duration,
    currentTranscript,
    interimTranscript,
    startRecording,
    stopRecording,
    sendTextMessage,
    editMessage,
    deleteMessage,
    resetChat,
  } = useChat(isConsultationStarted);

  const {
    analysis,
    isAnalyzing,
    error: analysisError,
    analyzeConsultation,
    clearAnalysis,
  } = useAIAnalysis(selectedPatient?.id, messages);

  // Verificar se pode fazer análise (tem paciente, consulta iniciada e mensagens)
  const canAnalyze = Boolean(selectedPatient?.id && isConsultationStarted && messages.length > 0);

  // Função para finalizar e salvar consulta
  const handleFinishConsultation = async () => {
    if (!isConsultationStarted || !selectedPatient?.id) {
      toast.error("Nenhuma consulta em andamento");
      return;
    }

    try {
      // Preparar mensagens para salvar
      const messagesToSave = messages.map((msg) => ({
        conteudo: msg.content,
        tipo_mensagem: msg.isVoice ? "audio" : "texto",
        audio_url: msg.isVoice ? undefined : undefined,
      }));

      // Preparar análise para salvar (se existir)
      const analysisToSave = analysis
        ? {
            diagnostico: analysis.diagnosis,
            cid10: analysis.cid10,
            sintomas: analysis.symptoms,
            exames_sugeridos: analysis.suggestedExams?.map((exam) => ({
              nome: exam.nome,
              justificativa: exam.motivo,
            })),
            medicamentos_sugeridos: analysis.suggestedMedications?.map((med) => ({
              nome: med.nome,
              dosagem: med.dosagem,
              frequencia: med.frequencia,
            })),
            notas_clinicas: analysis.notes,
            nivel_confianca:
              analysis.confidence > 0.8 ? "Alto" : analysis.confidence > 0.5 ? "Médio" : "Baixo",
          }
        : undefined;

      const result = await finishConsultation(messagesToSave, analysisToSave);

      if (result) {
        toast.success("Consulta finalizada e salva com sucesso!");
        // Redirecionar para histórico após 1 segundo
        setTimeout(() => {
          window.location.href = `/${window.location.pathname.split("/")[1]}/historico`;
        }, 1000);
      } else {
        toast.error("Erro ao salvar consulta");
      }
    } catch (error) {
      console.error("Erro ao finalizar consulta:", error);
      toast.error("Erro ao finalizar consulta");
    }
  };

  // Função para cancelar consulta
  const handleCancelConsultation = () => {
    clearConsultation();
    resetChat();
    clearAnalysis();
    selectPatient(null);
    toast.info("Consulta cancelada");
  };

  const handleNewPatient = () => {
    setIsModalOpen(true);
  };

  const handlePatientCreated = (newPatient: Patient) => {
    addNewPatient(newPatient);
    setIsModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Page Info */}
      {isConsultationStarted && (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-medical-100 dark:bg-medical-900/20 text-medical-700 dark:text-medical-400 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Consulta em Andamento
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {messages.length} mensagens • Não salvo
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCancelModalOpen(true)}
              disabled={isSaving}
            >
              Cancelar Consulta
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={handleFinishConsultation}
              disabled={isSaving || messages.length === 0}
            >
              {isSaving ? "Salvando..." : "Finalizar e Salvar Consulta"}
            </Button>
          </div>
        </div>
      )}

      {/* Patient Selector */}
      <PatientSelector
        patients={patients}
        selectedPatient={selectedPatient}
        isLoading={isLoadingPatients}
        onSelect={selectPatient}
        onNewPatient={handleNewPatient}
      />

      {/* Main Content - Grid Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Left Column - Chat */}
        <div className="flex flex-col min-h-0">
          <ChatSection
            patientId={selectedPatient?.id}
            patient={currentPatient}
            messages={messages}
            recordingState={recordingState}
            duration={duration}
            isConsultationStarted={isConsultationStarted}
            currentTranscript={currentTranscript}
            interimTranscript={interimTranscript}
            onStartConsultation={handleStartConsultation}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onSendMessage={sendTextMessage}
            onEditMessage={editMessage}
            onDeleteMessage={deleteMessage}
          />
        </div>

        {/* Right Column - AI Analysis Only */}
        <div className="flex flex-col overflow-y-auto">
          <AIAnalysisPanel
            analysis={analysis}
            isAnalyzing={isAnalyzing}
            onAnalyze={analyzeConsultation}
            canAnalyze={canAnalyze}
            error={analysisError}
          />
        </div>
      </div>

      {/* Modals */}
      <NewPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePatientCreated}
      />

      <CancelConsultationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelConsultation}
        messagesCount={messages.length}
      />
    </div>
  );
};
