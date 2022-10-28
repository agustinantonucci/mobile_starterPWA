import Menu from "../menu/Menu";
import Nav from "../navBar/Nav";
import "./MainLayout.css";

const MainLayout = ({ children, titulo = "", modo = "" }) => {

  return (
    <div className="vista_home_wrapper">
      <div className="vista_home_content">
        <div className="home_nav">
          <Nav titulo={titulo} modo={modo} />
        </div>
        <div className="home_contenido">{children}</div>
        <div className="home_menuInf">
          <Menu />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
