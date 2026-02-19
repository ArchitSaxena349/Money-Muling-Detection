import { Download } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ResultsDisplayProps {
  results: AnalysisResult | null;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results) return null;

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "analysis_results.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <p className="text-slate-400 text-sm">Suspicious Accounts</p>
          <p className="text-2xl font-bold text-slate-100">{results.summary.suspicious_accounts_flagged}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <p className="text-slate-400 text-sm">Fraud Rings</p>
          <p className="text-2xl font-bold text-slate-100">{results.summary.fraud_rings_detected}</p>
        </div>
      </div>

      {/* Fraud Rings Table */}
      {results.fraud_rings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-200">Detected Fraud Rings</h3>
          <div className="overflow-hidden rounded-xl border border-slate-700">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs uppercase bg-slate-800/80 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3">Ring ID</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Members</th>
                  <th className="px-6 py-3">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 bg-slate-900/30">
                {results.fraud_rings.map((ring) => (
                  <tr key={ring.ring_id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-200">{ring.ring_id}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs">
                        {ring.pattern_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{ring.member_accounts.join(', ')}</td>
                    <td className="px-6 py-4">
                      <span className="text-red-400 font-bold">{ring.risk_score}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Specific Accounts Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-200">Suspicious Accounts</h3>
        <div className="overflow-hidden rounded-xl border border-slate-700">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-slate-800/80 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3">Account ID</th>
                <th className="px-6 py-3">Score</th>
                <th className="px-6 py-3">Patterns</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 bg-slate-900/30">
              {results.suspicious_accounts.map((acc) => (
                <tr key={acc.account_id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-slate-200">{acc.account_id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                          style={{ width: `${acc.suspicion_score}%` }}
                        ></div>
                      </div>
                      <span className="text-slate-200 font-bold">{acc.suspicion_score.toFixed(0)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {acc.detected_patterns.map(p => (
                        <span key={p} className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={downloadJson}
        className="glass-button w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        Download Full Analysis JSON
      </button>
    </div>
  );
}
