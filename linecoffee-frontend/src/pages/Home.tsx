
import HeroSection from "./HeroScetion";
import ProductsBase from "./ProductsBase";
import ProductsSection from "./ProductsSection";
import ProductSliderSection2 from "./ProductsSection2";
import ProductSliderSection3 from "./ProductsSection3";
import CoinsSection from "./CoinsSection";
import About from "./About";
import Footer from "./Footer";



function Home() {


  return (
    <>
      <HeroSection/>
      <ProductsBase/>
    <ProductsSection/>
    <ProductSliderSection2/>
    <ProductSliderSection3/>
      <CoinsSection />
      <About/>
      <Footer/>
    </>
  );
}

export default Home