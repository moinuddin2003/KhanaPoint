import React from "react";
import DownloadBanner from "../../Components/Home/DownloadBanner";
import GetStarted from "../../Components/Home/GetStarted";
import { Images } from "../../assets";
import Navbar from "../../Components/common/Navbar";
import Footer from "../../Components/common/Footer";

export default function Home() {
  const handlePartnerClick = () => {
    // e.g. navigate("/partner-signup")
    console.log("Partner CTA clicked");
  };

  const handleRiderClick = () => {
    // e.g. navigate("/rider-signup")
    console.log("Rider CTA clicked");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <Navbar />

      <DownloadBanner />

      <GetStarted
        partnerImage={Images.Chef}
        riderImage={Images.Rider}
        onPartnerClick={handlePartnerClick}
        onRiderClick={handleRiderClick}
      />

      <Footer />
    </div>
  );
}
