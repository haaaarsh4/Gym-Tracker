import { UploadButton } from '@uploadthing/react';
import type { OurFileRouter } from '@/app/api/uploadthing/core';
import { ImageUpload } from '@/app/components/ImageUpload';
import GalleryComponent from '@/app/components/GalleryComponent'

export default function Gallary() {
  return (
    <div className=''>
        <GalleryComponent />
    </div>
  );
}

