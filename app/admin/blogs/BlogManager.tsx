"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Search, FileText } from 'lucide-react';
import Image from 'next/image';

interface Blog {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  author: string | null;
  createdAt: string;
}

export default function BlogManager() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/blogs');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (blog?: Blog) => {
    if (blog) {
      setEditingId(blog.id);
      setFormData({
        title: blog.title,
        content: blog.content,
        author: blog.author || "",
      });
      setImageFile(null);
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        content: "",
        author: "",
      });
      setImageFile(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!editingId;
    const url = '/api/admin/blogs';
    const method = isEditing ? 'PUT' : 'POST';

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('content', formData.content);
    if (formData.author) submitData.append('author', formData.author);
    if (imageFile) submitData.append('image', imageFile);
    if (isEditing && editingId) submitData.append('id', editingId);

    try {
      const res = await fetch(url, {
        method,
        body: submitData,
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchBlogs();
      } else {
        alert("Operation failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchBlogs();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" /> Blog Posts
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage articles and news for the website.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Post
          </button>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-gray-500 bg-gray-50 dark:bg-slate-950/50 border-y border-gray-100 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3 font-medium">Post</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Read Time</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">Loading blogs...</td>
              </tr>
            ) : filteredBlogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">No blog posts found.</td>
              </tr>
            ) : (
              filteredBlogs.map(blog => (
                <tr key={blog.id} className="hover:bg-gray-50 dark:hover:bg-[#141416] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 relative bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                        {blog.imageUrl ? (
                          <Image src={blog.imageUrl} alt={blog.title} fill sizes="64px" className="object-cover" />
                        ) : (
                          <FileText className="w-4 h-4 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      <div className="truncate max-w-[250px]">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{blog.title}</p>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {(() => {
                            try {
                              const data = JSON.parse(blog.content);
                              return data.summary || blog.content.substring(0, 100);
                            } catch {
                              return blog.content.substring(0, 100);
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                    {(() => {
                      try {
                        const data = JSON.parse(blog.content);
                        return data.category ? <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs font-semibold">{data.category}</span> : 'General';
                      } catch {
                        return 'General';
                      }
                    })()}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                    {(() => {
                      try {
                        const data = JSON.parse(blog.content);
                        return data.readingTime ? `${data.readingTime} min` : '5 min';
                      } catch {
                        return '5 min';
                      }
                    })()}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {blog.author || 'Admin'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleOpenModal(blog)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors mr-1"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {editingId ? 'Edit Post' : 'Add New Post'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="Post Title..."
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={e => setFormData({...formData, author: e.target.value})}
                    placeholder="e.g. Naman"
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Cover Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => e.target.files && setImageFile(e.target.files[0])}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  {editingId && (
                    <p className="text-[10px] text-gray-400 mt-1">Leave empty to keep existing image</p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">Content</label>
                  <button 
                    type="button" 
                    onClick={() => {
                      if (formData.content.startsWith('{')) {
                        // Switch to Markdown
                        if (confirm("Switching to Markdown will stringify your structured content. Continue?")) {
                          setFormData({...formData, content: ""});
                        }
                      } else {
                        // Switch to JSON
                        setFormData({...formData, content: JSON.stringify({
                          summary: formData.content || "",
                          postType: "ARTICLE",
                          readingTime: 5,
                          category: "General",
                          sections: []
                        }, null, 2)});
                      }
                    }}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Toggle Format (JSON/Markdown)
                  </button>
                </div>
                
                {(() => {
                  try {
                    // Try parsing as JSON to show structured editor
                    if (!formData.content.trim().startsWith('{')) throw new Error("Not JSON");
                    const data = JSON.parse(formData.content);
                    
                    const updateJson = (newData: any) => {
                      setFormData({...formData, content: JSON.stringify(newData, null, 2)});
                    };

                    return (
                      <div className="space-y-4 bg-gray-50/50 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Summary</label>
                          <textarea
                            value={data.summary || ''}
                            onChange={e => updateJson({...data, summary: e.target.value})}
                            rows={3}
                            className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Category</label>
                            <input
                              type="text"
                              value={data.category || ''}
                              onChange={e => updateJson({...data, category: e.target.value})}
                              className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Reading Time (mins)</label>
                            <input
                              type="number"
                              value={data.readingTime || ''}
                              onChange={e => updateJson({...data, readingTime: parseInt(e.target.value) || 0})}
                              className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t border-gray-200 dark:border-slate-700">
                          <div className="flex justify-between items-center mb-3">
                            <label className="block text-[10px] uppercase font-bold text-gray-500">Sections</label>
                            <button
                              type="button"
                              onClick={() => {
                                const newSections = [...(data.sections || []), { title: '', description: '' }];
                                updateJson({...data, sections: newSections});
                              }}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-bold hover:bg-primary/20"
                            >
                              + Add Section
                            </button>
                          </div>
                          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {(data.sections || []).map((sec: any, idx: number) => (
                              <div key={idx} className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-gray-200 dark:border-slate-800 relative">
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const newSections = data.sections.filter((_: any, i: number) => i !== idx);
                                    updateJson({...data, sections: newSections});
                                  }}
                                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                                <input
                                  type="text"
                                  placeholder="Section Title"
                                  value={sec.title}
                                  onChange={e => {
                                    const newSections = [...data.sections];
                                    newSections[idx].title = e.target.value;
                                    updateJson({...data, sections: newSections});
                                  }}
                                  className="w-full bg-transparent border-b border-gray-200 dark:border-slate-700 pb-1 mb-2 text-sm font-bold focus:border-primary outline-none"
                                />
                                <textarea
                                  placeholder="Section Description..."
                                  value={sec.description}
                                  onChange={e => {
                                    const newSections = [...data.sections];
                                    newSections[idx].description = e.target.value;
                                    updateJson({...data, sections: newSections});
                                  }}
                                  rows={3}
                                  className="w-full bg-transparent text-sm focus:ring-0 outline-none resize-y"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  } catch (e) {
                    // Fallback to markdown textarea
                    return (
                      <textarea
                        required
                        value={formData.content}
                        onChange={e => setFormData({...formData, content: e.target.value})}
                        placeholder="Write your article here..."
                        rows={8}
                        className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none resize-y"
                      />
                    );
                  }
                })()}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> {editingId ? 'Save Changes' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
