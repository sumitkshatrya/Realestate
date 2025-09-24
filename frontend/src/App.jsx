
import { DarkModeProvider } from "./components/DarkModeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./sections/About";
import Client from "./sections/Client";
import Contact from "./sections/Contact";
import Hero from "./sections/Hero";
import PopularAreas from "./sections/PopularAreas";
import Properties from "./sections/Properties";
import Services from "./sections/Services";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
    <DarkModeProvider>
      
      <div>
        <Header />
        <Hero />
        <About />
        <PopularAreas />
        <Properties />
        <Services />
        <Client />
        <Contact />
        <Footer />
      </div>
     </DarkModeProvider>
     </AuthProvider>
  );
};

export default App;