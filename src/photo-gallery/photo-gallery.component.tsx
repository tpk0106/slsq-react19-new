import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import PLUGIN_ZOOM from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { API_BASE } from "../config/api";

// ─── Types ───────────────────────────────────────────────────────

interface GalleryImage {
  Id: number;
  ImageUrl: string;
  Caption: string | null;
  DisplayOrder: number;
}

interface Gallery {
  Id: number;
  Title: string;
  Description: string | null;
  images: GalleryImage[];
}

// ─── Component ───────────────────────────────────────────────────

const PhotoGallery = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSlides, setLightboxSlides] = useState<{ src: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/gallery`);
        if (!res.ok) throw new Error("Failed to load galleries.");
        const data: Gallery[] = await res.json();
        setGalleries(data);
      } catch (err: any) {
        setError(err.message || "Failed to load galleries.");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  const handleGalleryClick = (gallery: Gallery) => {
    if (!gallery.images || gallery.images.length === 0) return;

    const slides = gallery.images.map((img) => ({
      src: `${API_BASE}${img.ImageUrl}`,
    }));

    setLightboxSlides(slides);
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="mx-5 pb-5">
        <div className="container m-auto w-[100%] mt-5 mb-10 text-center py-10">
          <p className="text-lg">Loading galleries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-5 pb-5">
        <div className="container m-auto w-[100%] mt-5 mb-10 text-center py-10">
          <p className="text-lg text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-5 pb-5">
        <div
          id="photo-gallery"
          className="container m-auto w-[100%] mt-5 mb-10"
        >
          <div className="flex flex-col text-center py-5 text-base md:text-[20px] lg:text-[30px]">
            <div>
              {galleries.map((gallery) => (
                <button
                  key={gallery.Id}
                  onClick={() => handleGalleryClick(gallery)}
                  className="mb-5 font-bold text-white shadow-[0px_0px_rgba(0,0,0,1)] hover:drop-shadow-[2px_2px_rgba(0,0,0,.5)] hover:cursor-pointer block w-full text-center bg-transparent border-none p-2"
                  disabled={!gallery.images || gallery.images.length === 0}
                  style={{
                    opacity:
                      !gallery.images || gallery.images.length === 0 ? 0.5 : 1,
                  }}
                >
                  {gallery.Title}
                  {gallery.images && gallery.images.length > 0 && (
                    <span className="text-sm md:text-base lg:text-lg ml-2 opacity-70">
                      ({gallery.images.length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {galleries.length === 0 && (
            <div className="text-center py-10">
              <p className="text-lg text-gray-400">No galleries available.</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Carousel */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        index={lightboxIndex}
        plugins={[PLUGIN_ZOOM]}
      />
    </>
  );
};

export default PhotoGallery;
