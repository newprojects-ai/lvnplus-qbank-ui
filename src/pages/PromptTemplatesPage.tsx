import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Template } from '@lvnplus/core';
import { TemplateList } from '../components/templates/TemplateList';
import { TemplateEditor } from '../components/templates/TemplateEditor';
import { TemplatePreview } from '../components/templates/TemplatePreview';
import toast from 'react-hot-toast';
import { apiClient } from '../api/apiClient';
import { PromptTemplate } from '../api/types';

export function PromptTemplatesPage() {
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.getPromptTemplates()
      .then(setTemplates)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Create template mutation
  const createMutation = useMutation({
    mutationFn: async (template: Template) => {
      const response = await apiClient.createPromptTemplate(template);
      return response.data;
    },
    onSuccess: () => {
      setTemplates((prevTemplates) => [...prevTemplates, editingTemplate as PromptTemplate]);
      setShowEditor(false);
      toast.success('Template created successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create template');
    }
  });

  // Update template mutation
  const updateMutation = useMutation({
    mutationFn: async (template: Template) => {
      const response = await apiClient.updatePromptTemplate(template.id, template);
      return response.data;
    },
    onSuccess: () => {
      setTemplates((prevTemplates) => prevTemplates.map((tpl) => tpl.id === editingTemplate?.id ? editingTemplate as PromptTemplate : tpl));
      setShowEditor(false);
      setEditingTemplate(null);
      toast.success('Template updated successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update template');
    }
  });

  // Delete template mutation
  const deleteMutation = useMutation({
    mutationFn: async (template: Template) => {
      await apiClient.deletePromptTemplate(template.id);
    },
    onSuccess: () => {
      setTemplates((prevTemplates) => prevTemplates.filter((tpl) => tpl.id !== editingTemplate?.id));
      toast.success('Template deleted successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete template');
    }
  });

  const handleSave = (template: Template) => {
    if (editingTemplate) {
      updateMutation.mutate(template);
    } else {
      createMutation.mutate(template);
    }
  };

  const handleDuplicate = (template: Template) => {
    const duplicatedTemplate = {
      ...template,
      id: undefined,
      name: `${template.name} (Copy)`,
      currentVersion: {
        ...template.currentVersion,
        id: undefined,
        version: 1
      }
    };
    createMutation.mutate(duplicatedTemplate as Template);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Prompt Templates</h1>
        <button
          onClick={() => {
            setEditingTemplate(null);
            setShowEditor(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5" />
          New Template
        </button>
      </div>

      {showEditor ? (
        <TemplateEditor
          template={editingTemplate || undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowEditor(false);
            setEditingTemplate(null);
          }}
        />
      ) : (
        <TemplateList
          templates={templates || []}
          onEdit={(template) => {
            setEditingTemplate(template);
            setShowEditor(true);
          }}
          onDelete={(template) => {
            if (confirm('Are you sure you want to delete this template?')) {
              deleteMutation.mutate(template);
            }
          }}
          onDuplicate={handleDuplicate}
          onPreview={(template) => setPreviewTemplate(template)}
        />
      )}

      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <TemplatePreview
              template={previewTemplate}
              onClose={() => setPreviewTemplate(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}