export interface User {
  id: string;
  email: string;
  progress: Record<string, number>;
}

export interface Algorithm {
  id: string;
  name: string;
  category: 'symmetric' | 'asymmetric' | 'hash' | 'signature';
  description: string;
  complexity: string;
  security: string;
  applications: string[];
}

export interface Quiz {
  id: string;
  algorithmId: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}