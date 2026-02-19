import { useState } from 'react';

import FileUpload from './components/FileUpload';
import GraphVisualization from './components/GraphVisualization';
import ResultsDisplay from './components/ResultsDisplay';
import { Transaction, AnalysisResult, GraphData } from './types';
import { ShieldCheck, UploadCloud, Network, Activity, AlertTriangle } from 'lucide-react';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const backendData = await response.json();

      setTransactions(backendData.transactions);

      const analysis: AnalysisResult = {
        suspicious_accounts: backendData.suspicious_accounts,
        fraud_rings: backendData.fraud_rings,
        summary: backendData.summary
      };
      setAnalysisResult(analysis);

      setGraphData({
        nodes: backendData.nodes,
        links: backendData.edges
      });

    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError(`Analysis Failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-blue-500/30">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <header className="glass-panel rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                LaundroGraph
              </h1>
              <p className="text-sm text-slate-400">Financial Crime Detection Engine</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-sm text-slate-400">
              v1.0.0
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          {/* Upload Section */}
          <section className="glass-panel rounded-2xl p-8 transition-all duration-300 hover:border-blue-500/30">
            <div className="flex items-center gap-3 mb-6">
              <UploadCloud className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-slate-100">Transaction Data Upload</h2>
            </div>
            <FileUpload onFileSelect={handleFileSelect} disabled={isLoading} />

            {isLoading && (
              <div className="mt-8 flex flex-col items-center justify-center space-y-4 animate-pulse">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-blue-400 font-medium tracking-wide">Analyzing Transaction Graph...</p>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </section>

          {/* Visualization & Results */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-panel rounded-2xl p-6 h-[700px] flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <Network className="w-6 h-6 text-violet-400" />
                <h2 className="text-xl font-semibold text-slate-100">Network Visualization</h2>
              </div>
              <div className="flex-grow rounded-xl overflow-hidden bg-slate-900/50 border border-slate-800 relative">
                <GraphVisualization data={graphData} analysisResult={analysisResult} />
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 h-[700px] overflow-hidden flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-6 h-6 text-emerald-400" />
                <h2 className="text-xl font-semibold text-slate-100">Analysis Report</h2>
              </div>
              <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                <ResultsDisplay results={analysisResult} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
