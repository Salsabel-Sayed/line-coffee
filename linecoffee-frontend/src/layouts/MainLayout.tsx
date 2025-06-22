import { Outlet } from "react-router-dom";
import NavBar from "../pages/NavBar";
import Footer from "../pages/Footer";


function MainLayout() {
  return (  
          <>
              <NavBar />
      <main >
                  <Outlet />
        <Footer />
              </main>
              
          </>
    
        );
}

export default MainLayout