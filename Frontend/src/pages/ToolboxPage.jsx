import { useNavigate } from "react-router-dom";
import { GovHeader } from "../components/Header/GovHeader";
import { NavBar2 } from "../components/NavBar2/NavBar2";
import Footer from "../components/Footer/Footer";
import ThrustToWeightCalculator from "../components/ThrustToWeightCalculator";
import PayloadCalculator from "../components/PayloadCalculator";
import BatteryVisualizer from "../components/BatteryVisualizer";
import PropellerCalculator from "../components/PropellerCalculator";
import { Wrench } from "lucide-react";

export function ToolboxPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <GovHeader />

      <div className="sticky top-0 z-[90]">
        <NavBar2
          domain={{
            name: "UNMANNED AIRCRAFT SYSTEM (DRONE) LAB",
            logo: (
              <img
                src="/drone_images/test_drone.png"
                alt="DroneLab Logo"
                className="h-8 w-8 object-contain"
              />
            ),
          }}
          isSticky={false}
          className="bg-[#050510]/70 backdrop-blur-lg text-white flex justify-between items-center px-7 py-2 border-b border-white/5"
          authLinks={{
            login: {
              text: "Login",
              onClick: () => navigate("/auth?tab=login"),
              variant: "ghost",
              className: "text-white hover:text-white/80",
            },
            register: {
              text: "Get Started",
              onClick: () => navigate("/auth?tab=signup"),
              variant: "default",
              className: "bg-white text-black hover:bg-white/90",
            },
          }}
        />
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 lg:px-8">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-4">
            <Wrench className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Drone Builder's Toolbox
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Essential calculators and utilities to help you design, optimize, and safely operate your custom drones.
          </p>
        </div>

        <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
          <ThrustToWeightCalculator />
          <PayloadCalculator />
          <BatteryVisualizer />
          <PropellerCalculator />
        </div>
      </main>

      <Footer />
    </div>
  );
}
