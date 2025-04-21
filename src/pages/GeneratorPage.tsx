import React from 'react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Brain, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiClient } from '../api/apiClient';
import type { Template, AIConfig, GenerationStatus } from '../api/types';

interface Template {
  id: string;
  name: string;
  subject_name: string;
  topic_name: string;
  subtopic_name: string;
}

interface AIConfig {
  id: string;
  provider: string;
  model: string;
  temperature: number;
}

interface GenerationStatus {
  batchId: string;
  status: 'pending' | 'completed' | 'failed';
  progress: number;
  total: number;
  error?: string;
}

export function GeneratorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [count, setCount] = useState(5);
  const [difficultyLevel, setDifficultyLevel] = useState(2);
  const [temperature, setTemperature] = useState(0.7);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus | null>(null);

  const { data: templates } = useQuery<Template[]>({
    queryKey: ['templates'],
    queryFn: async () => apiClient.getPromptTemplates(),
  });

  const { data: aiConfigs } = useQuery<AIConfig[]>({
    queryKey: ['ai-configs'],
    queryFn: async () => apiClient.getAIConfigs(),
  });

  const selectedTemplateDetails = templates?.find(t => t.id === selectedTemplate);

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a template');
      return;
    }
    setIsGenerating(true);
    setGenerationStatus(null);
    try {
      const batch = await apiClient.startGeneration({
        templateId: selectedTemplate,
        count,
        difficultyLevel,
        temperature,
      });
      setGenerationStatus({
        batchId: batch.id,
        status: 'pending',
        progress: 0,
        total: count,
      });
      toast.success('Generation started!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to start generation');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (generationStatus?.status === 'pending') {
      interval = setInterval(async () => {
        try {
          const status = await apiClient.getGenerationStatus(generationStatus.batchId);
          setGenerationStatus(prev => ({
            ...prev!,
            status: status.status,
            progress: status.progress,
            error: status.error_message,
          }));

          if (status.status !== 'pending') {
            clearInterval(interval);
            if (status.status === 'completed') {
              toast.success('Questions generated successfully!');
            } else if (status.status === 'failed') {
              toast.error('Generation failed: ' + status.error_message);
            }
          }
        } catch (error) {
          console.error('Status check error:', error);
        }
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [generationStatus?.batchId, generationStatus?.status]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Question Generator</h1>
      
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white"
            >
              <option value="">Select a template</option>
              {templates?.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {selectedTemplateDetails && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Template Details</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Subject</p>
                  <p className="font-medium">{selectedTemplateDetails.subject_name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Topic</p>
                  <p className="font-medium">{selectedTemplateDetails.topic_name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Subtopic</p>
                  <p className="font-medium">{selectedTemplateDetails.subtopic_name}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Easy</span>
                <span>Medium</span>
                <span>Hard</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Temperature
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Consistent</span>
                <span>Balanced</span>
                <span>Creative</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!selectedTemplate || isGenerating}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Brain className="w-5 h-5" />
            {isGenerating ? 'Starting Generation...' : 'Generate Questions'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Generation Status</h2>
          
          {generationStatus ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  generationStatus.status === 'completed' ? 'bg-green-500' :
                  generationStatus.status === 'failed' ? 'bg-red-500' :
                  'bg-yellow-500'
                }`} />
                <span className="font-medium capitalize">{generationStatus.status}</span>
              </div>
              
              {generationStatus.status === 'pending' && (
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-500"
                      style={{ width: `${(generationStatus.progress / generationStatus.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Generated {generationStatus.progress} of {generationStatus.total} questions
                  </p>
                </div>
              )}
              
              {generationStatus.status === 'failed' && generationStatus.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{generationStatus.error}</p>
                </div>
              )}
              
              {generationStatus.status === 'completed' && (
                <p className="text-sm text-gray-700">
                  Successfully generated {generationStatus.total} questions! You can now review them in the Reviewer page.
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No active generation</p>
          )}
        </div>
      </div>
    </div>
  );
}