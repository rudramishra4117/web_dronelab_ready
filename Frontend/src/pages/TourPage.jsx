import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Viewer } from '@photo-sphere-viewer/core';
import { VirtualTourPlugin } from '@photo-sphere-viewer/virtual-tour-plugin';

import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/virtual-tour-plugin/index.css';
import { GovHeader } from '../components/Header/GovHeader';
import { NavBar2 } from '../components/NavBar2/NavBar2';
import Footer from '../components/Footer/Footer';
import { degrees } from 'framer-motion';

export const TourPage = () => {
  const navigate = useNavigate();
  const viewerRef = useRef(null);
  const viewerInstance = useRef(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    if (!viewerInstance.current) {
      viewerInstance.current = new Viewer({
        container: viewerRef.current,
        loadingImg: '',
        touchmoveTwoFingers: true,
        mousewheelCtrlKey: true,
        plugins: [
          [VirtualTourPlugin, {
            positionMode: 'manual',
            renderMode: '3d',
            startNodeId: 'node-9',
            nodes: [
              {
                id: 'node-1',
                panorama: '/panoramas/image_1.jpg',
                name: 'Lab Area 1',
                caption: 'Entrance Area',
                links: [
                  {
                    nodeId: 'node-2',
                    position: { pitch: 0, yaw: 250 },
                  },
                  {
                    nodeId: 'node-9',
                    position: { pitch: 0, yaw: 179 },
                  },
                  {
                    nodeId: 'node-8',
                    position: { pitch: 0, yaw: 0 },
                  },
                ],
                sphereCorrection: {
                  tilt: 0,
                  pan: 120,
                  roll: 0
                }
              },
              {
                id: 'node-2',
                panorama: '/panoramas/image_2.jpg',
                name: 'Lab Area 2',
                caption: 'simulation area',
                defaultPitch: 0,
                links: [
                  {
                    nodeId: 'node-3',
                    position: { pitch: 0, yaw: 9 },
                  },
                  {
                    nodeId: 'node-1',
                    position: { pitch: 0, yaw: 0 },
                  },
                ],
                sphereCorrection: {
                  tilt: 0,
                  pan: 270,
                  roll: 0,
                }
              },
              {
                id: 'node-3',
                panorama: '/panoramas/image_3.jpg',
                name: 'Lab Area 3',
                caption: 'building area',
                links: [
                  {
                    nodeId: 'node-2',
                    position: { pitch: 0, yaw: -1 },
                  },
                  {
                    nodeId: 'node-4',
                    position: { pitch: 0, yaw: -179 },
                  },
                ],
                sphereCorrection: {
                  tilt: 0,
                  pan: 0,
                  roll: 0,
                }
              },
              {
                id: 'node-4',
                panorama: '/panoramas/image_4.jpg',
                name: 'Lab Area 4',
                caption: 'storage area',
                links: [
                  {
                    nodeId: 'node-3',
                    position: { pitch: 0, yaw: 0 },
                  },
                  {
                    nodeId: 'node-5',
                    position: { pitch: 0, yaw: -90 },
                  },
                ],
                sphereCorrection: {
                  tilt: 0,
                  pan: -298,
                  roll: 0,
                }
              },
              {
                id: 'node-5',
                panorama: '/panoramas/image_5.jpg',
                name: 'Lab Area 5',
                caption: '3d printing area',
                links: [
                  {
                    nodeId: 'node-6',
                    position: { pitch: 0, yaw: 90 },
                  },
                  {
                    nodeId: 'node-4',
                    position: { pitch: 0, yaw: -90 },
                  },
                ],
                sphereCorrection: {
                  tilt: 0,
                  pan: 301,
                  roll: 0,
                }
              },
              {
                id: 'node-6',
                panorama: '/panoramas/image_6.jpg',
                name: 'workstation area',
                caption: 'Lab Area 6',
                links: [
                  {
                    nodeId: 'node-7',
                    position: { pitch: 0, yaw: 179 },
                  },
                  {
                    nodeId: 'node-5',
                    position: { pitch: 0, yaw: 0 },
                  },
                ],
                sphereCorrection: {
                  tilt: 0,
                  pan: 359,
                  roll: 0,
                }
              },
              {
                id: 'node-7',
                panorama: '/panoramas/image_7.jpg',
                name: 'Lab Area 7',
                caption: 'display area',
                links: [
                  {
                    nodeId: 'node-8',
                    position: { pitch: 0, yaw: 179 },
                  },
                  {
                    nodeId: 'node-6',
                    position: { pitch: 0, yaw: 125 },
                  },
                ],
                sphereCorrection: {
                  tilt: 0,
                  pan: 90,
                  roll: 0,
                }

              },
              {
                id: 'node-8',
                panorama: '/panoramas/image_8.jpg',
                name: 'Lab Area 8',
                caption: 'display area',
                links: [
                  {
                    nodeId: 'node-7',
                    position: { pitch: 0, yaw: 0 },
                  },
                  {
                    nodeId: 'node-1',
                    position: { pitch: 0, yaw: 179 },
                  },
                ],
                sphereCorrection: {
                  tilt: 0,
                  pan: 90,
                  roll: 0,
                }
              },
              {
                id: 'node-9',
                panorama: '/panoramas/image_9.jpg',
                name: 'Lab Area 9',
                caption: 'Entry/Exit',
                links: [
                  {
                    nodeId: 'node-1',
                    position: { pitch: 0, yaw: 0 },
                  },

                ],
                sphereCorrection: {
                  tilt: 0,
                  pan: 129,
                  roll: 0
                }
              },
            ],
          }],
        ],
      });
    }

    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
        viewerInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="tour-page flex flex-col min-h-screen">
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

      <main className="flex-1 px-4 py-8 max-w-[1400px] mx-auto w-full flex flex-col">
        <div className="mb-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Virtual Lab Tour
          </h1>
          <p className="text-[var(--text-secondary)] mt-2 text-lg">
            Explore our state-of-the-art facilities in 360 degrees.
          </p>
        </div>

        <div className="flex-1 w-full relative rounded-2xl overflow-hidden shadow-[0_8px_40px_var(--card-shadow)] border-[var(--card-border)] bg-[var(--card-bg)] min-h-[600px] backdrop-blur-lg">
          <div
            ref={viewerRef}
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};
