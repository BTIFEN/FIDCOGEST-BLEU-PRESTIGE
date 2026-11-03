import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home, RefreshCw, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[FIDCOGEST Security Guard] Exception UI interceptée par l’Error Boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center p-4 text-[#1F2937]">
          <div className="max-w-lg w-full bg-white rounded-2xl border border-[#E8E6DF] shadow-xl p-6 sm:p-8 space-y-5 text-center">
            
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
              <ShieldAlert className="w-7 h-7 text-amber-700" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#142B45]">
                {this.props.fallbackTitle || 'Affichage sécurisé — Incident intercepté'}
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                Une anomalie d'interface a été interceptée par le système de protection FIDCOGEST. L'intégrité de vos dossiers et de vos données comptables reste garantie.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-[#FAF9F6] border border-[#E8E6DF] rounded-xl p-3 text-xs font-mono text-slate-700 overflow-x-auto max-h-32">
                <span className="text-rose-700 font-bold block mb-1">Détail technique :</span>
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="cabinet-btn-primary flex-1 text-xs justify-center py-2.5 font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Home className="w-4 h-4" />
                Retourner à l'accueil
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="cabinet-btn-secondary flex-1 text-xs justify-center py-2.5 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Actualiser la page
              </button>
            </div>

            <div className="pt-2 border-t border-[#E8E6DF] text-[11px] text-[#6B7280]">
              Cabinet FIDCOGEST SRL • Expert-comptable &amp; Conseil fiscal certifié ITAA
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
