"use client";

import { UploadButton } from '@uploadthing/react';
import type { OurFileRouter } from '@/app/api/uploadthing/core';
import { ImageUpload } from '@/app/components/ImageUpload';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react'; // Import trash icon

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

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={image.id} className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="aspect-square">
              <img 
                src={image.imageUrl} 
                alt={`Workout ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Date overlay in top right */}
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                {new Date(image.createdAt).toLocaleDateString()}
              </div>

              {/* Delete button - appears on hover */}
              <button
                onClick={() => handleDeleteImage(image.id)}
                disabled={deletingIds.has(image.id)}
                className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete image"
              >
                {deletingIds.has(image.id) ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Show message if no images */}
      {images.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No workout images yet. Upload your first one!</p>
        </div>
      )}
    </div>
  );
}