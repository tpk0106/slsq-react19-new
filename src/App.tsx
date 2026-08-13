import "./App.css";
import { Routes, Route } from "react-router-dom";
import navbarData from "./data/nav-data";
import Home from "./home.component";
import Header from "./navigation/header.component";
import Administrator from "./admin/admin.component";
import Members from "./admin/members.component";
import Root from "./root/root.component";

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
        </Route>
      </Routes>
    </>
  );
}

export default App;
