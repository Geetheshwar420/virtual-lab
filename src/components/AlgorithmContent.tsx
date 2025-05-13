import React from 'react';
import { Lock, Key, Hash, FileSignature } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  code?: string;
}

interface AlgorithmProps {
  title: string;
  description: string;
  steps: Step[];
  complexity: string;
  security: string;
  applications: string[];
}

export function AlgorithmContent({
  title,
  description,
  steps,
  complexity,
  security,
  applications,
}: AlgorithmProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Time Complexity</h3>
            <p className="text-gray-600 dark:text-gray-300">{complexity}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Security Considerations</h3>
            <p className="text-gray-600 dark:text-gray-300">{security}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Applications</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
              {applications.map((app, index) => (
                <li key={index}>{app}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Implementation Steps</h3>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold mb-2">{step.title}</h4>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{step.description}</p>
              {step.code && (
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <code>{step.code}</code>
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}