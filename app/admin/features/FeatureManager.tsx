"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Feature {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface Vehicle {
  id: string;
  name: string;
  category: string;
  features: Feature[] | null;
  imageUrl: string;
}

export default function FeatureManager() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // For editing the features list as a whole before saving
  const [currentFeatures, setCurrentFeatures] = useState<Feature[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Form state for a single feature
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (selectedVehicle) {
      setCurrentFeatures(selectedVehicle.features || []);
      setHasChanges(false);
    } else {
      setCurrentFeatures([]);
    }
  }, [selectedVehicle]);

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/admin/features');
      if (res.ok) {
        const data = await res.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (index: number | null = null) => {
    if (index !== null) {
      setEditingIndex(index);
      setFormData({
        title: currentFeatures[index].title,
        description: currentFeatures[index].description,
        image: currentFeatures[index].image
      });
    } else {
      setEditingIndex(null);
      setFormData({
        title: '',
        description: '',
        image: ''
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setImageFile(null);
    setFormData({ title: '', description: '', image: '' });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Upload immediately for preview
      setIsUploading(true);
      const data = new FormData();
      data.append('file', file);
      
      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: data
        });
        
        if (res.ok) {
          const result = await res.json();
          setFormData(prev => ({ ...prev, image: result.url }));
        } else {
          alert('Failed to upload image');
        }
      } catch (error) {
        console.error(error);
        alert('Upload error');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSaveFeature = () => {
    if (!formData.title || !formData.description) {
      alert("Title and description are required.");
      return;
    }

    const updatedFeatures = [...currentFeatures];
    
    if (editingIndex !== null) {
      updatedFeatures[editingIndex] = {
        ...updatedFeatures[editingIndex],
        title: formData.title,
        description: formData.description,
        image: formData.image || updatedFeatures[editingIndex].image
      };
    } else {
      const newId = updatedFeatures.length > 0 ? Math.max(...updatedFeatures.map(f => f.id || 0)) + 1 : 1;
      updatedFeatures.push({
        id: newId,
        title: formData.title,
        description: formData.description,
        image: formData.image
      });
    }

    setCurrentFeatures(updatedFeatures);
    setHasChanges(true);
    handleCloseModal();
  };

  const handleRemoveFeature = (index: number) => {
    if (confirm('Are you sure you want to remove this feature?')) {
      const updated = [...currentFeatures];
      updated.splice(index, 1);
      setCurrentFeatures(updated);
      setHasChanges(true);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedVehicle) return;
    setIsSaving(true);
    
    try {
      const res = await fetch('/api/admin/features', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: selectedVehicle.id,
          features: currentFeatures
        })
      });

      if (res.ok) {
        alert('Features saved successfully!');
        setHasChanges(false);
        fetchVehicles(); // Refresh list to update selected vehicle's cached data
      } else {
        alert('Failed to save changes.');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving features.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start h-[calc(100vh-200px)]">
      
      {/* Sidebar: Vehicle List */}
      <div className="w-full lg:w-1/3 xl:w-1/4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950">
          <h2 className="font-bold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-widest">Select Model</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {vehicles.map(v => (
            <button
              key={v.id}
              onClick={() => setSelectedVehicle(v)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                selectedVehicle?.id === v.id 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 border border-transparent'
              }`}
            >
              <div className="w-10 h-10 bg-white dark:bg-slate-950 rounded-lg p-1 shrink-0 flex items-center justify-center">
                {v.imageUrl && (
                  <Image src={v.imageUrl} alt={v.name} width={40} height={40} className="object-contain drop-shadow-md" />
                )}
              </div>
              <div className="truncate">
                <div className="font-bold text-sm truncate">{v.name}</div>
                <div className="text-[10px] uppercase font-bold opacity-60 tracking-wider">{v.category.replace('_', ' ')}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Features Editor */}
      <div className="flex-1 w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
        {!selectedVehicle ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
            <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
            <p className="font-medium">Select a vehicle from the list to manage its features.</p>
          </div>
        ) : (
          <>
            <div className="p-5 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between bg-gray-50 dark:bg-slate-950">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center shadow-sm">
                  {selectedVehicle.imageUrl && (
                    <Image src={selectedVehicle.imageUrl} alt={selectedVehicle.name} width={40} height={40} className="object-contain" />
                  )}
                </div>
                <div>
                  <h2 className="font-black text-lg text-gray-900 dark:text-white">{selectedVehicle.name}</h2>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{currentFeatures.length} Features configured</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleOpenModal()}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black text-sm font-bold rounded-xl hover:opacity-80 transition-opacity"
                >
                  <Plus className="w-4 h-4" /> Add Feature
                </button>
                {hasChanges && (
                  <button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50 dark:bg-slate-950/50">
              {currentFeatures.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No features configured for this model yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentFeatures.map((feature, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all">
                      <div className="h-40 bg-gray-100 dark:bg-black/20 relative flex items-center justify-center p-4">
                        {feature.image ? (
                          <img src={feature.image.startsWith('http') ? feature.image : `/models/features/${feature.image}`} alt={feature.title} className="object-contain w-full h-full drop-shadow-md" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-gray-300 dark:text-gray-700" />
                        )}
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenModal(idx)} className="p-1.5 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-md shadow-sm hover:bg-blue-50 dark:hover:bg-slate-700">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleRemoveFeature(idx)} className="p-1.5 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 rounded-md shadow-sm hover:bg-red-50 dark:hover:bg-slate-700">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-black text-sm text-gray-900 dark:text-white mb-1 line-clamp-1">{feature.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Feature Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-950">
              <h3 className="font-black text-lg">{editingIndex !== null ? 'Edit Feature' : 'Add New Feature'}</h3>
              <button onClick={handleCloseModal} className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Feature Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Bold Front Visor"
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Feature Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the feature in 1-2 sentences..."
                  rows={3}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Feature Image (Optional)</label>
                
                {formData.image && (
                  <div className="mb-3 w-32 h-32 bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center p-2 relative border border-gray-200 dark:border-slate-700">
                    <img src={formData.image.startsWith('http') ? formData.image : `/models/features/${formData.image}`} alt="Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                )}

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 disabled:opacity-50"
                  />
                  {isUploading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 mt-2">Uploading an image automatically saves it to Cloudinary.</p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3 bg-gray-50 dark:bg-slate-950">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveFeature}
                disabled={isUploading || !formData.title || !formData.description}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                <Check className="w-4 h-4" /> Save Feature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
