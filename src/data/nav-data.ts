import AboutUs from "../about-us/about-us.component";
import ContactUs from "../contact-us/contact-us.component";
import Publications from "../publications/publications.component";
import PhotoGallery from "../photo-gallery/photo-gallery.component";
import NoticeBoard from "../notice-board/notice-board.component";
import Home from "../home.component";
import Events from "../events/events.component";

export const navbarData = [
  {
    routerLink: "home",
    element: Home,
    icon: "",
    label: "Home",
    subMenus: null,
  },
  {
    routerLink: "publications",
    element: Publications,
    icon: "",
    label: "Publications",
    subMenus: null,
  },
  {
    routerLink: "events",
    element: Events,
    icon: "",
    label: "Events",
    subMenus: null,
  },
  {
    routerLink: "photo-gallery",
    element: PhotoGallery,
    icon: "",
    label: "Photo Gallery",
    subMenus: null,
  },
  {
    routerLink: "contact-us",
    element: ContactUs,
    icon: "",
    label: "Contact Us",
    subMenus: null,
  },
  {
    routerLink: "about-us",
    element: AboutUs,
    icon: "",
    label: "About Us",
    subMenus: null,
  },
  {
    routerLink: "notice-board",
    element: NoticeBoard,
    icon: "",
    label: "Notice Board",
    subMenus: null,
  },
];

export default navbarData;
