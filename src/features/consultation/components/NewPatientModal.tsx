/**
 * NewPatientModal
 * Modal para cadastrar novo paciente com 2 steps
 */

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper";
import { Select } from "@/components/ui/Select";
import { useWorkspace } from "@/hooks/useWorkspace";
import api from "@/lib/axios";
import type { PatientFormData, Patient, BloodType } from "../types/consultation.types";

interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (patient: Patient) => void;
}

export const NewPatientModal = ({ isOpen, onClose, onSuccess }: NewPatientModalProps) => {
  const workspace = useWorkspace();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PatientFormData>({
    nome: "",
    data_nascimento: "",
    telefone: "",
    tipo_sanguineo: undefined,
    historico_medico: "",
    email: "",
    endereco: "",
    cpf: "",
    observacoes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const steps = [
    { label: "Dados Básicos", description: "Informações essenciais" },
    { label: "Informações Médicas", description: "Histórico e observações" },
  ];

  const validateStep1 = (): string[] => {
    const validationErrors: string[] = [];

    // Obrigatórios
    if (!formData.nome || formData.nome.length < 3) {
      validationErrors.push("Nome deve ter no mínimo 3 caracteres");
    }
    if (!formData.data_nascimento) {
      validationErrors.push("Data de nascimento é obrigatória");
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.data_nascimento)) {
      validationErrors.push("Data de nascimento deve estar no formato DD/MM/AAAA");
    }

    // Opcionais do Step 1 (se preenchidos)
    if (formData.telefone && !/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/.test(formData.telefone)) {
      validationErrors.push("Telefone inválido. Use o formato (00) 00000-0000");
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.push("Email inválido");
    }

    return validationErrors;
  };

  const validateStep2 = (): string[] => {
    const validationErrors: string[] = [];

    // Validações do Step 2 (se preenchidos)
    if (formData.cpf && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      validationErrors.push("CPF inválido. Use o formato 000.000.000-00");
    }

    return validationErrors;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
  };

  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
  };

  const handleNextStep = () => {
    // Validar Step 1 antes de avançar
    const validationErrors = validateStep1();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    setCurrentStep(2);
  };

  const handlePreviousStep = () => {
    setErrors([]);
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!workspace) {
      alert("Workspace não encontrado");
      return;
    }

    // Validar Step 2
    const validationErrors = validateStep2();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      // Converter data de DD/MM/YYYY para YYYY-MM-DD
      const [day, month, year] = formData.data_nascimento.split("/");
      const formattedDate = `${year}-${month}-${day}`;

      const payload = {
        nome: formData.nome,
        data_nascimento: formattedDate,
        telefone: formData.telefone || undefined,
        tipo_sanguineo: formData.tipo_sanguineo || undefined,
        historico_medico: formData.historico_medico || undefined,
        email: formData.email || undefined,
        endereco: formData.endereco || undefined,
        cpf: formData.cpf || undefined,
        observacoes: formData.observacoes || undefined,
      };

      const response = await api.post(`/${workspace.slug}/patients`, payload);
      const patientData = response.data.data;

      onSuccess(patientData);
      onClose();

      // Reset form
      setFormData({
        nome: "",
        data_nascimento: "",
        telefone: "",
        tipo_sanguineo: undefined,
        historico_medico: "",
        email: "",
        endereco: "",
        cpf: "",
        observacoes: "",
      });
      setCurrentStep(1);
    } catch (error) {
      console.error("Erro ao criar paciente:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar paciente. Tente novamente.";
      setErrors([errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalContent showClose onClose={onClose} className="max-w-2xl min-w-[600px]">
        <ModalHeader>
          <ModalTitle>Novo Paciente</ModalTitle>
          <ModalDescription>Preencha os dados do paciente para iniciar a consulta</ModalDescription>
        </ModalHeader>

        <form
          onSubmit={
            currentStep === 1
              ? (e) => {
                  e.preventDefault();
                  handleNextStep();
                }
              : handleSubmit
          }
        >
          <ModalBody className="space-y-6">
            {/* Stepper */}
            <Stepper steps={steps} currentStep={currentStep} />

            {/* Exibir erros de validação */}
            {errors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step 1: Dados Básicos */}
            {currentStep === 1 && (
              <div className="grid grid-cols-2 gap-4">
                {/* Nome Completo - OBRIGATÓRIO */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    minLength={3}
                    maxLength={200}
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20"
                    placeholder="Ex: João Silva Santos"
                  />
                </div>

                {/* Data de Nascimento - OBRIGATÓRIO */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data de Nascimento *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.data_nascimento}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        data_nascimento: formatDate(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20"
                    placeholder="DD/MM/AAAA"
                    maxLength={10}
                  />
                </div>

                {/* Telefone - RECOMENDADO */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Telefone <span className="text-xs text-gray-500">(recomendado)</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        telefone: formatPhone(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border-l-2 border-l-blue-500 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20"
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20"
                    placeholder="joao@email.com"
                  />
                </div>

                {/* Endereço */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Endereço
                  </label>
                  <textarea
                    value={formData.endereco}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        endereco: e.target.value,
                      })
                    }
                    rows={3}
                    maxLength={500}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20"
                    placeholder="Rua, número, bairro, cidade/estado"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Informações Médicas */}
            {currentStep === 2 && (
              <div className="grid grid-cols-2 gap-4">
                {/* Tipo Sanguíneo - RECOMENDADO */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo Sanguíneo <span className="text-xs text-gray-500">(recomendado)</span>
                  </label>
                  <Select
                    value={formData.tipo_sanguineo || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        tipo_sanguineo: value ? (value as BloodType) : undefined,
                      });
                    }}
                    className="border-l-2 border-l-blue-500"
                  >
                    <option value="">Selecione</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </Select>
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cpf: formatCPF(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20"
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>

                {/* Histórico Médico - RECOMENDADO */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Histórico Médico <span className="text-xs text-gray-500">(recomendado)</span>
                  </label>
                  <textarea
                    value={formData.historico_medico}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        historico_medico: e.target.value,
                      })
                    }
                    rows={3}
                    maxLength={2000}
                    className="w-full rounded-lg border-l-2 border-l-blue-500 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20"
                    placeholder="Alergias, condições pré-existentes, medicamentos em uso..."
                  />
                </div>

                {/* Observações */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Observações Gerais
                  </label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        observacoes: e.target.value,
                      })
                    }
                    rows={3}
                    maxLength={1000}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20"
                    placeholder="Notas adicionais sobre o paciente"
                  />
                </div>
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            {currentStep === 1 ? (
              <>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">Próximo</Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={handlePreviousStep}>
                  Voltar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar Paciente"}
                </Button>
              </>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
