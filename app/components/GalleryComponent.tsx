"use client";

import { UploadButton } from '@uploadthing/react';
import type { OurFileRouter } from '@/app/api/uploadthing/core';
import { ImageUpload } from '@/app/components/ImageUpload';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Trash2, Maximize2, Calendar } from 'lucide-react';

// Define the type for your gallery images
interface GalleryImage {
  id: string;
  imageUrl: string;
  createdAt: string;
}

export default function GalleryComponent() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/gallery');
        if (!response.ok) {
          throw new Error('Failed to fetch gallery images');
        }
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        toast.error('Failed to load gallery images');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleImageUploaded = () => {
    // Refresh the images after upload
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        }
      } catch (error) {
        console.error('Error refreshing images:', error);
      }
    };
    fetchImages();
  };

  const handleDeleteImage = async (imageId: string) => {
    // Add to deleting set to show loading state
    setDeletingIds(prev => new Set(prev).add(imageId));

    try {
      const response = await fetch(`/api/gallery/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      // Remove image from local state immediately for better UX
      setImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    } finally {
      // Remove from deleting set
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className=''>
        <div className='flex items-center justify-between mb-8'>
          <h1 className="text-center font-bold text-3xl">
            Workout <span className="text-blue-500">Gallery</span>
          </h1>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading your workout images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-8'>
        <h1 className="text-center font-bold text-3xl">
          Workout <span className="text-blue-500">Gallery</span>
        </h1>
        <div className='flex-shrink-0 ml-4'>
          <ImageUpload onImageUploaded={handleImageUploaded} />
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div key={image.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            {/* Image Container */}
            <div className="relative">
              <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                <img 
                  src={image.imageUrl} 
                  alt={`Workout ${index + 1}`}
                  className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              
              {/* Hover overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                <button
                  onClick={() => setSelectedImage(image.imageUrl)}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors shadow-lg"
                  title="View full size"
                >
                  <Maximize2 size={20} />
                </button>
                
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  disabled={deletingIds.has(image.id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete image"
                >
                  {deletingIds.has(image.id) ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show message if no images */}
      {images.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No workout images yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Upload your first workout image to get started!</p>
          </div>
        </div>
      )}

      {/* Full-size image modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl max-h-[95vh] w-full">
            <img 
              src={selectedImage}
              alt="Full size view"
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors text-xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}