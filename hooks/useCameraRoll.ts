import { useState, useEffect } from "react";

// 🚫 MVP: Mock CameraRoll for MVP (camera roll functionality disabled)
const cameraRollModule = {
  getPhotos: () =>
    Promise.reject(new Error("Camera roll functionality disabled for MVP")),
  save: () =>
    Promise.reject(new Error("Camera roll functionality disabled for MVP")),
  saveToCameraRoll: () =>
    Promise.reject(new Error("Camera roll functionality disabled for MVP")),
  GroupTypes: {
    Album: "Album",
    All: "All",
    Event: "Event",
    Faces: "Faces",
    Library: "Library",
    PhotoStream: "PhotoStream",
    SavedPhotos: "SavedPhotos",
  },
  MediaType: {
    photo: "photo",
    video: "video",
  },
};

export interface PhotoIdentifier {
  node: {
    id: string;
    image: {
      uri: string;
      width: number;
      height: number;
    };
    timestamp: number;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
}

export const CameraRoll = cameraRollModule;

export const useCameraRoll = () => {
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const getPhotos = async () => {
    console.log("🚫 Camera roll functionality disabled for MVP");
    setPhotos([]);
    setLoading(false);
    setHasNextPage(false);
  };

  useEffect(() => {
    // Don't load photos automatically for MVP
  }, []);

  return {
    photos,
    loading,
    hasNextPage,
    getPhotos,
  };
};
