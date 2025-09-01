import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import PLUGIN_ZOOM from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

// import Captions from "yet-another-react-lightbox/plugins/captions";
// import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
// import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
// import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
// import Video from "yet-another-react-lightbox/plugins/video";
// import Zoom from "yet-another-react-lightbox/plugins/zoom";
// import zoomIn from "yet-another-react-lightbox/plugins/zoom/zoomIn";
// import Inline from "yet-another-react-lightbox/plugins/inline";

type img = {
  src: string;
};

type imageSet = {
  images: img[];
  setParentState: () => void;
};

const DisplayImage = ({ images, setParentState }: imageSet) => {
  const [open, setOpen] = useState(true);
  //const zoomRef = useRef(null);

  const imageSource: any = [];
  images.forEach((image) => {
    const file = require("../" + image.src);
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
        //plugins={[Inline, Zoom]}
        // zoom={{ ref: zoomRef }}
        // inline={{
        //   style: { width: '100%', maxWidth: '900px', aspectRatio: '3 / 2' },
        // }}
      />
    </div>
  );
};

export default DisplayImage;
