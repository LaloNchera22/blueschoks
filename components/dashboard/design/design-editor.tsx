'use client';

import React, { useState, useEffect } from 'react';
import { DesignConfig, LinkItem } from '@/lib/types/design-system';
import { saveThemeConfig } from '@/app/dashboard/actions/design-actions';
// We might need to cast the config to 'any' when saving if types mismatch with existing action
// or update the action. For now, we assume strict adherence to 'DesignConfig' internally,
// and we'll handle the save carefully.

interface DesignEditorProps {
  initialConfig: DesignConfig;
  userId: string;
  slug: string;
}

export default function DesignEditor({ initialConfig, userId, slug }: DesignEditorProps) {
  const [config, setConfig] = useState<DesignConfig>(initialConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'links' | 'appearance'>('profile');

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="p-8">Loading editor...</div>;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // We are saving to the 'theme_config' column via the existing action.
      // We cast to 'any' because strict Typescript might complain if theme-config.ts
      // hasn't been updated to match DesignConfig yet.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await saveThemeConfig(config as any);

      if (!result.success) {
        alert('Error saving changes');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving changes');
    } finally {
      setIsSaving(false);
    }
  };

  const updateConfig = (section: keyof DesignConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: value
    }));
  };

  // Helper for deep updates
  const updateNested = (section: keyof DesignConfig, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [key]: value
      }
    }));
  };

  // Link Management
  const addLink = () => {
    const newLink: LinkItem = {
      id: Math.random().toString(36).substr(2, 9),
      platform: 'website',
      url: '',
      label: 'New Link',
      active: true
    };

    // SAFETY: ensure socialLinks is an array before spreading
    const currentLinks = Array.isArray(config.socialLinks) ? config.socialLinks : [];
    updateConfig('socialLinks', [...currentLinks, newLink]);
  };

  const updateLink = (id: string, field: keyof LinkItem, value: any) => {
    if (!Array.isArray(config.socialLinks)) return;

    const newLinks = config.socialLinks.map(link =>
      link.id === id ? { ...link, [field]: value } : link
    );
    updateConfig('socialLinks', newLinks);
  };

  const removeLink = (id: string) => {
    if (!Array.isArray(config.socialLinks)) return;
    const newLinks = config.socialLinks.filter(link => link.id !== id);
    updateConfig('socialLinks', newLinks);
  };

  return (
    <div className="flex h-full w-full">
      {/* Editor Sidebar */}
      <div className="w-[400px] flex-shrink-0 border-r bg-white h-full flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg">Design Editor</h2>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {(['profile', 'links', 'appearance'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                <input
                  type="text"
                  value={config.profile?.shopName || ''}
                  onChange={(e) => updateNested('profile', 'shopName', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={config.profile?.bio || ''}
                  onChange={(e) => updateNested('profile', 'bio', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                <input
                  type="text"
                  value={config.profile?.avatarUrl || ''}
                  onChange={(e) => updateNested('profile', 'avatarUrl', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          )}

          {/* LINKS TAB */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              <button
                onClick={addLink}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-800"
              >
                + Add New Link
              </button>

              <div className="space-y-3">
                {Array.isArray(config.socialLinks) && config.socialLinks.map((link, index) => (
                  <div key={link.id} className="p-3 border rounded-md bg-gray-50 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono text-gray-400">#{index + 1}</span>
                      <button onClick={() => removeLink(link.id)} className="text-red-500 text-xs hover:underline">Remove</button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Label</label>
                        <input
                          type="text"
                          value={link.label || ''}
                          onChange={(e) => updateLink(link.id, 'label', e.target.value)}
                          className="w-full p-1 text-sm border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Platform</label>
                        <select
                          value={link.platform}
                          onChange={(e) => updateLink(link.id, 'platform', e.target.value)}
                          className="w-full p-1 text-sm border rounded"
                        >
                          <option value="website">Website</option>
                          <option value="instagram">Instagram</option>
                          <option value="tiktok">TikTok</option>
                          <option value="twitter">Twitter</option>
                          <option value="facebook">Facebook</option>
                          <option value="whatsapp">WhatsApp</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">URL</label>
                      <input
                        type="text"
                        value={link.url || ''}
                        onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                        className="w-full p-1 text-sm border rounded"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.colors?.background || '#ffffff'}
                    onChange={(e) => updateNested('colors', 'background', e.target.value)}
                    className="h-8 w-8 rounded border"
                  />
                  <span className="text-sm text-gray-500">{config.colors?.background}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.colors?.text || '#000000'}
                    onChange={(e) => updateNested('colors', 'text', e.target.value)}
                    className="h-8 w-8 rounded border"
                  />
                   <span className="text-sm text-gray-500">{config.colors?.text}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.colors?.cardBackground || '#f3f4f6'}
                    onChange={(e) => updateNested('colors', 'cardBackground', e.target.value)}
                    className="h-8 w-8 rounded border"
                  />
                   <span className="text-sm text-gray-500">{config.colors?.cardBackground}</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Live Preview (Simplified for new component) */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden w-[375px] h-[812px] border-8 border-gray-900 relative">
          {/* Preview Header */}
          <div className="absolute top-0 w-full h-12 bg-gray-100 border-b flex items-center justify-center text-xs text-gray-500 z-10">
            Preview: /{slug}
          </div>

          <div
            className="w-full h-full overflow-y-auto pt-12 pb-8"
            style={{
              backgroundColor: config.colors?.background || '#ffffff',
              color: config.colors?.text || '#000000',
              fontFamily: config.fonts?.body || 'sans-serif'
            }}
          >
            {/* Profile Header */}
            <div className="p-6 text-center space-y-4">
              {config.profile?.avatarUrl && (
                <img
                  src={config.profile.avatarUrl}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-sm"
                />
              )}
              <div>
                <h1 className="text-xl font-bold" style={{ fontFamily: config.fonts?.heading }}>
                  {config.profile?.shopName || 'My Shop'}
                </h1>
                <p className="text-sm opacity-80 mt-1">{config.profile?.bio}</p>
              </div>
            </div>

            {/* Links */}
            <div className="px-6 space-y-3">
              {Array.isArray(config.socialLinks) && config.socialLinks.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 text-center rounded-xl transition-transform hover:scale-[1.02] active:scale-95"
                  style={{
                    backgroundColor: config.colors?.cardBackground || '#f3f4f6',
                    color: config.colors?.primary || '#000000'
                  }}
                >
                  <span className="font-medium">{link.label || link.platform}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
