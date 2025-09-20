import Footer from "@/components/footer/Footer";
import CallToAction from "@/components/homeComponents/CallToAction";
import Faq from "@/components/homeComponents/Faq";
import FeaturesSection from "@/components/homeComponents/FeaturesSection";
import GetMoreTechs from "@/components/homeComponents/GetMoreTechs";
import HeaderHome from "@/components/homeComponents/HeaderHome";
import NavBarHome from "@/components/homeComponents/NavBarHome";
import WhatYouGet from "@/components/homeComponents/WhatYouGet";
import WhyUs from "@/components/homeComponents/WhyUs";
import ScrollToTopButton from "@/components/utlisComponenets/ScrollToTopButton";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <>
      <NavBarHome />
      <div className="lg:px-10 container mx-auto ">
        <ToastContainer />
        <HeaderHome />
        <WhyUs />
        <WhatYouGet />
        <GetMoreTechs />
        <FeaturesSection />
        <Faq />
        <CallToAction />
        {/* btn to scroll to top */}
        <ScrollToTopButton />
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}
