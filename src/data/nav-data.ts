import AboutUs from "../about-us/about-us.component";
import ContactUs from "../contact-us/contact-us.component";
import CommitteeMembers from "../committe-members/committe-members.component";
import Publications from "../publications/publications.component";
import PhotoGallery from "../photo-gallery/photo-gallery.component";
import PastEvents from "../past-events/past-events.component";
import UpComingEvents from "../upcoming-events/upcoming-events.component";
import NoticeBoard from "../notice-board/notice-board.component";

export const navbarData = [
  {
    routerLink: "about-us",
    element: AboutUs,
    icon: "",
    label: "About Us",
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
    routerLink: "committee",
    element: CommitteeMembers,
    icon: "",
    label: "Committee Members",
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
    routerLink: "publications",
    element: Publications,
    icon: "",
    label: "Publications",
    subMenus: null,
  },
  {
    routerLink: "upcoming-events",
    element: UpComingEvents,
    icon: "",
    label: "UpComing Events",
    subMenus: null,
  },
  {
    routerLink: "past-events",
    element: PastEvents,
    icon: "",
    label: "Past Events",
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
