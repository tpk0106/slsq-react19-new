import "./App.css";
import { Routes, Route } from "react-router-dom";
import navbarData from "./data/nav-data";
import Home from "./home.component";
import Header from "./navigation/header.component";
import Administrator from "./admin/admin.component";
import Members from "./admin/members.component";
import RegisterUser from "./admin/register-user.component";
import Root from "./root/root.component";
import Presidents from "./admin/presidents.component";
import Events from "./admin/events.component";
import PhotoGallery from "./admin/photo-gallery.component";
import AdminPublications from "./admin/publications.component";
import NoticeBoard from "./admin/noticeboard.component";

const HOME = <Home />;
// const HEADER = <Header />;
const ROOT = "/";
const ROOTCOMPONENT = <Root />;

function App() {
  return (
    <>
      <Routes>
        <Route path={ROOT} element={ROOTCOMPONENT}>
          <Route index path={ROOT} element={HOME} />
          {navbarData.map((item) => (
            <Route path={item.routerLink} element={item.element()} />
          ))}
          <Route path="/admin" element={Administrator()} />
          <Route path="/members" element={Members()} />
          <Route path="/register" element={RegisterUser()} />
          <Route path="/presidents" element={<Presidents />} />
          <Route path="/events-admin" element={<Events />} />
          <Route path="/noticeboard-admin" element={<NoticeBoard />} />
          <Route path="/gallery-admin" element={<PhotoGallery />} />
          <Route path="/publications-admin" element={<AdminPublications />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
