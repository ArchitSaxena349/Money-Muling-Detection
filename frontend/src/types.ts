export interface Transaction {
  transaction_id: string;
  sender_id: string;
  receiver_id: string;
  amount: number;
  timestamp: string; // YYYY-MM-DD HH:MM:SS
}

export interface SuspiciousAccount {
  account_id: string;
  suspicion_score: number;
  detected_patterns: string[];
  ring_id: string | null;
}

export interface FraudRing {
  ring_id: string;
  member_accounts: string[];
  pattern_type: string;
  risk_score: number;
}

export interface AnalysisSummary {
  total_accounts_analyzed: number;
  suspicious_accounts_flagged: number;
  fraud_rings_detected: number;
  processing_time_seconds: number;
}

export interface AnalysisResult {
  suspicious_accounts: SuspiciousAccount[];
  fraud_rings: FraudRing[];
  summary: AnalysisSummary;
}

export interface GraphNode {
  id: string;
  degree: number;
  isSuspicious?: boolean;
}

export interface GraphLink {
  source: string;
  target: string;
  amount: number;
  timestamp: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
