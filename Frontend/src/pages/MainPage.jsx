import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GovHeader } from "../components/Header/GovHeader";
import { useEffect, useState } from "react";
import { getServices } from "../api/axios";

export function MainPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    // Set the JWT in a cookie so Nginx can read it for the CAD iframe auth_request
    const token = localStorage.getItem("access_token");
    if (token) {
      document.cookie = `dronelab_jwt=${token}; path=/`;
    }

    getServices()
      .then((res) => setServicesData(res.data))
      .catch((err) => console.error("Failed to fetch services in MainPage", err));
  }, []);

  const handleLogout = () => {
    // Clear the cookie on logout
    document.cookie = "dronelab_jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    logout();
    navigate("/");
  };

  return (
    <div className="dashboard-page min-h-screen flex flex-col items-center bg-[#181818]">
      <GovHeader />

      <main className="flex-1 w-full px-2 sm:px-6 py-8 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md font-medium transition-colors"
          >
            Back to Main Site
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-8 mt-12 w-full max-w-4xl">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Welcome to the DroneLab Dashboard
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Your central hub for unmanned aircraft systems. Launch our powerful tools below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8 max-w-6xl">
            {servicesData.map((service, index) => {
              // Generate slightly different gradient colors based on index
              const gradients = [
                "from-blue-500/10 to-purple-500/10",
                "from-green-500/10 to-emerald-500/10",
                "from-orange-500/10 to-amber-500/10",
                "from-pink-500/10 to-rose-500/10",
                "from-cyan-500/10 to-teal-500/10",
              ];
              const bgColors = [
                "bg-blue-500/20 text-blue-400",
                "bg-green-500/20 text-green-400",
                "bg-orange-500/20 text-orange-400",
                "bg-pink-500/20 text-pink-400",
                "bg-cyan-500/20 text-cyan-400",
              ];
              const colorIdx = index % gradients.length;

              return (
                <div key={service.id} className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradients[colorIdx]} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  
                  <div className="relative z-10 flex flex-col items-start gap-4">
                    <div className={`p-4 rounded-lg ${bgColors[colorIdx]}`}>
                      {service.image ? (
                        <img src={service.image} alt={service.title} className="w-8 h-8 object-cover rounded" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-semibold text-white">{service.title}</h3>
                    <p className="text-muted-foreground">
                      {service.description}
                    </p>
                    
                    <button
                      onClick={() => {
                        if (service.is_external) {
                          window.location.href = service.url;
                        } else {
                          navigate(service.url);
                        }
                      }}
                      className="mt-4 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all shadow-lg shadow-primary/25 flex items-center gap-2 group-hover:-translate-y-0.5"
                    >
                      Launch
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

