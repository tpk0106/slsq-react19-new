import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import PLUGIN_ZOOM from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { resolveAsset } from "../utils/resolve-asset";

type img = {
  src: string;
};

type imageSet = {
  images: img[];
  setParentState: () => void;
};

const DisplayImage = ({ images, setParentState }: imageSet) => {
  const [open, setOpen] = useState(true);

  const imageSource: img[] = [];
  images.forEach((image) => {
    const file = resolveAsset(require("../" + image.src));
    imageSource.push({ src: file });
  });

  const handleGalleryClose = () => {
    setOpen(false);
    setParentState();
  };

  if (!open) return null;

  return (
    <div>
      <Lightbox
        open={open}
        close={() => handleGalleryClose()}
        plugins={[PLUGIN_ZOOM]}
        slides={imageSource}
      />
    </div>
  );
};

export default DisplayImage;
export { DisplayImage as di };
