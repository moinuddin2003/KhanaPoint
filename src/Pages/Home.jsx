import React from "react";
import HeroBanner from "../Components/Home/HeroBanner";
import PartnerRideSection from "../components/Home/PartnerRideSection";

// Replace these with the actual image paths/imports you're providing.
import chef from "../assets/chef.png";
import logo from "../assets/logo-1.png";
import couple from "../assets/couple.png";
import badges from "../assets/store-badges.png";
import rider from "../assets/rider.png";

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
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <HeroBanner imageLogo={logo} imageSrc={couple} appBadgesSrc={badges} />

      <PartnerRideSection
        partnerImage={chef}
        riderImage={rider}
        onPartnerClick={handlePartnerClick}
        onRiderClick={handleRiderClick}
      />
    </div>
  );
}
