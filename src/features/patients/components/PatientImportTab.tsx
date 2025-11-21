import { Button } from "@/components/ui/Button";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";

export function PatientImportTab() {
  return (
    <div className="w-full h-full p-6">
      <div className="w-full border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:bg-muted/5 transition-colors cursor-pointer bg-card">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Arraste e solte seu arquivo aqui</h3>
            <p className="text-sm text-muted-foreground mt-1">Suporta arquivos .CSV ou .XLSX</p>
          </div>
          <Button variant="outline">Selecionar Arquivo</Button>
        </div>
      </div>

      <div className="mt-8 space-y-4 w-full">
        <h4 className="font-medium flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Modelo de Importação
        </h4>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md flex gap-3 items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="mb-2">
              Para garantir que a importação funcione corretamente, utilize nossa planilha modelo.
              As colunas obrigatórias são: <strong>Nome</strong>, <strong>CPF</strong> (ou Data de
              Nascimento).
            </p>
            <Button
              variant="link"
              className="h-auto p-0 text-blue-700 dark:text-blue-300 underline"
            >
              Baixar planilha modelo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
