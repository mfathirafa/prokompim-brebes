import { Loader2 } from "lucide-react";

export default function PublicLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <Loader2 className="w-5 h-5 text-primary absolute animate-pulse" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-foreground">
          Memuat Informasi...
        </p>
        <p className="text-xs text-muted-foreground">
          Portal Bagian Protokol dan Komunikasi Pimpinan
        </p>
      </div>
    </div>
  );
}
