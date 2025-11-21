import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { patientSchema, type PatientInput } from "@/schemas/patient.schema";
import { useCreatePatient } from "../hooks/usePatients";
import { toast } from "sonner";

export function PatientFormTab() {
  const createPatient = useCreatePatient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PatientInput>({
    resolver: zodResolver(patientSchema),
  });

  const onSubmit = async (data: PatientInput) => {
    try {
      await createPatient.mutateAsync(data);
      toast.success("Paciente cadastrado com sucesso!");
      reset();
    } catch (error) {
      toast.error("Erro ao cadastrar paciente. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <div className="w-full h-full overflow-auto p-6">
      <div className="max-w-6xl mx-auto border rounded-lg bg-card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Cadastrar Novo Paciente</h3>
          <p className="text-sm text-muted-foreground">
            Preencha os dados abaixo para registrar um novo paciente no sistema.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Dados Pessoais
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  placeholder="Ex: João da Silva"
                  error={errors.nome?.message}
                  {...register("nome")}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  error={errors.cpf?.message}
                  {...register("cpf")}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
                <Input
                  id="data_nascimento"
                  type="date"
                  error={errors.data_nascimento?.message}
                  {...register("data_nascimento")}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@email.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="telefone">Telefone / WhatsApp</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  error={errors.telefone?.message}
                  {...register("telefone")}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  placeholder="Rua, Número, Bairro"
                  error={errors.endereco?.message}
                  {...register("endereco")}
                />
              </div>
            </div>
          </div>

          {/* Dados Médicos */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Dados Médicos
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="tipo_sanguineo">Tipo Sanguíneo</Label>
                <Select
                  id="tipo_sanguineo"
                  {...register("tipo_sanguineo")}
                  error={errors.tipo_sanguineo?.message}
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

              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="historico_medico">Histórico Médico</Label>
                <Textarea
                  id="historico_medico"
                  placeholder="Alergias, cirurgias prévias, condições crônicas..."
                  className="min-h-[60px] resize-none"
                  error={errors.historico_medico?.message}
                  {...register("historico_medico")}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="observacoes">Observações Gerais</Label>
              <Textarea
                id="observacoes"
                placeholder="Outras informações relevantes..."
                className="min-h-[60px] resize-none"
                error={errors.observacoes?.message}
                {...register("observacoes")}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t">
            <Button variant="outline" type="button" onClick={() => reset()}>
              Limpar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Cadastrando..." : "Cadastrar Paciente"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
