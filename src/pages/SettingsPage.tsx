import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import type { AIConfig, AIProvider, AIModel, VariableCategory, VariableDefinition, VariableType } from '../api/types';
import { Plus, Pencil, Trash2, Settings, Zap, Server, Cpu, Variable } from 'lucide-react';
import toast from 'react-hot-toast';
import { ConfigModal } from '../components/settings/ConfigModal';
import { ProviderModal } from '../components/settings/ProviderModal';
import { ModelModal } from '../components/settings/ModelModal';
import { CategoryModal } from '../components/settings/CategoryModal';
import { VariableModal } from '../components/settings/VariableModal';

export function SettingsPage() {
  const [aiConfigs, setAIConfigs] = useState<AIConfig[]>([]);
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [models, setModels] = useState<AIModel[]>([]);
  const [categories, setCategories] = useState<VariableCategory[]>([]);
  const [variables, setVariables] = useState<VariableDefinition[]>([]);
  const [variableTypes, setVariableTypes] = useState<VariableType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isVariableModalOpen, setIsVariableModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<AIConfig | null>(null);
  const [editingProvider, setEditingProvider] = useState<AIProvider | null>(null);
  const [editingModel, setEditingModel] = useState<AIModel | null>(null);
  const [editingCategory, setEditingCategory] = useState<VariableCategory | null>(null);
  const [editingVariable, setEditingVariable] = useState<VariableDefinition | null>(null);

  useEffect(() => {
    // Fetch all settings data using apiClient
    apiClient.getAIConfigs().then(setAIConfigs);
    apiClient.getAIProviders().then(setProviders);
    apiClient.getAIModels().then(setModels);
    apiClient.getVariableCategories().then(setCategories);
    apiClient.getVariableDefinitions().then(setVariables);
    apiClient.getVariableTypes().then(setVariableTypes);
  }, []);

  const handleTestConfig = async (config: AIConfig) => {
    try {
      const response = await apiClient.testAIConfig(config.id);
      if (response.success) {
        toast.success('Configuration test successful!');
      } else {
        toast.error(response.error || 'Test failed');
      }
    } catch (error) {
      console.error('Test error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to test configuration');
    }
  };

  const handleDeleteVariable = async (variable: VariableDefinition) => {
    if (!confirm('Are you sure you want to delete this variable?')) return;
    try {
      await apiClient.deleteVariableDefinition(variable.id);
      toast.success('Variable deleted successfully');
    } catch (error) {
      toast.error('Failed to delete variable');
    }
  };

  const handleDeleteCategory = async (category: VariableCategory) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await apiClient.deleteVariableCategory(category.id);
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setEditingCategory(null);
              setIsCategoryModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Variable className="w-5 h-5" />
            Add Category
          </button>
          <button
            onClick={() => {
              setEditingProvider(null);
              setIsProviderModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Server className="w-5 h-5" />
            Add Provider
          </button>
          <button
            onClick={() => {
              setEditingModel(null);
              setIsModelModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Cpu className="w-5 h-5" />
            Add Model
          </button>
          <button
            onClick={() => {
              setEditingConfig(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" />
            Add Configuration
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* AI Configurations Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-medium text-gray-900">AI Configurations</h2>
            </div>
          </div>
          <div className="space-y-4">
            {aiConfigs?.map((config) => (
              <div key={config.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{config.name}</h3>
                    <p className="text-sm text-gray-500">
                      {config.provider} - {config.model_name}
                    </p>
                    {config.is_default && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTestConfig(config)}
                      className="p-2 text-gray-600 hover:text-yellow-600 rounded-lg hover:bg-gray-100"
                    >
                      <Zap className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingConfig(config);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm('Are you sure you want to delete this configuration?')) return;
                        try {
                          await apiClient.deleteAIConfig(config.id);
                          toast.success('Configuration deleted successfully');
                        } catch (error) {
                          toast.error('Failed to delete configuration');
                        }
                      }}
                      className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Providers Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-medium text-gray-900">AI Providers</h2>
            </div>
          </div>
          <div className="space-y-4">
            {providers?.map((provider) => (
              <div key={provider.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{provider.name}</h3>
                    <p className="text-sm text-gray-500">{provider.description}</p>
                    {provider.api_base_url && (
                      <p className="text-sm text-gray-500 mt-1">API: {provider.api_base_url}</p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setEditingProvider(provider);
                      setIsProviderModalOpen(true);
                    }}
                    className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Models Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-medium text-gray-900">AI Models</h2>
            </div>
          </div>
          <div className="space-y-4">
            {models?.map((model) => (
              <div key={model.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{model.name}</h3>
                    <p className="text-sm text-gray-500">{model.description}</p>
                    <div className="mt-2 flex gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Max Tokens: {model.max_tokens}
                      </span>
                      {model.supports_functions && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Functions
                        </span>
                      )}
                      {model.supports_vision && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Vision
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEditingModel(model);
                      setIsModelModalOpen(true);
                    }}
                    className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Variables Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Variable className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-medium text-gray-900">Variable Categories</h2>
            </div>
          </div>
          <div className="space-y-4">
            {categories?.map((category) => (
              <div key={category.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.description}</p>
                    <div className="mt-2 space-y-2">
                      {variables?.filter(v => v.category_id === category.id).map((variable) => (
                        <div key={variable.id} className="pl-4 border-l-2 border-gray-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700">{variable.display_name}</h4>
                              <p className="text-xs text-gray-500">{variable.description}</p>
                              <div className="mt-1 flex gap-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  {variableTypes?.find(t => t.id === variable.variable_type_id)?.name}
                                </span>
                                {variable.is_required && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                    Required
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingVariable(variable);
                                  setIsVariableModalOpen(true);
                                }}
                                className="p-1 text-gray-600 hover:text-indigo-600 rounded hover:bg-gray-100"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteVariable(variable)}
                                className="p-1 text-gray-600 hover:text-red-600 rounded hover:bg-gray-100"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setEditingVariable(null);
                          setSelectedCategory(category.id);
                          setIsVariableModalOpen(true);
                        }}
                        className="ml-4 flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
                      >
                        <Plus className="w-4 h-4" />
                        Add Variable
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setIsCategoryModalOpen(true);
                      }}
                      className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Provider Modal */}
      <ProviderModal
        isOpen={isProviderModalOpen}
        onClose={() => setIsProviderModalOpen(false)}
        provider={editingProvider}
      />

      {/* Model Modal */}
      <ModelModal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        model={editingModel}
      />

      {/* Config Modal */}
      <ConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        config={editingConfig}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        category={editingCategory}
      />

      {/* Variable Modal */}
      {selectedCategory && (
        <VariableModal
          isOpen={isVariableModalOpen}
          onClose={() => setIsVariableModalOpen(false)}
          categoryId={selectedCategory}
          variable={editingVariable}
        />
      )}
    </div>
  );
}