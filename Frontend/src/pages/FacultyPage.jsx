import React from "react";
import { useNavigate } from "react-router-dom";
import { GovHeader } from "../components/Header/GovHeader";
import { NavBar2 } from "../components/NavBar2/NavBar2";
import Footer from "../components/Footer/Footer";
import { FaXTwitter as X, FaLinkedin as LinkedIn, FaDribbble as DribbbleIcon } from "react-icons/fa6";

const Avatar = ({ src, alt, className }) => (
    <img
        src={src}
        alt={alt}
        className={`rounded-full object-cover border-2 border-border ${className}`}
    />
);

const teamMembers = [

    {
        name: "Anil Kumar Shaw",
        title: "Dir-in-C, NIELIT BBSR",
        summary: "Former PM for Linear, Lambda School, and On Deck.",
        avatarUrl: "/Facutly/image1.png",
        socials: [
            {
                icon: X,
                href: "https://x.com/",
            },
            {
                icon: LinkedIn,
                href: "https://www.linkedin.com/",
            },
            {
                icon: DribbbleIcon,
                href: "https://dribbble.com/",
            },
        ],
    },
    {
        name: "Debendra Das",
        title: "Faculty",
        summary: "Former frontend dev for Linear, Coinbase, and Postscript.",
        avatarUrl: "/Facutly/image2.png",
        socials: [
            {
                icon: X,
                href: "https://x.com/",
            },
            {
                icon: LinkedIn,
                href: "https://www.linkedin.com/",
            },
            {
                icon: DribbbleIcon,
                href: "https://dribbble.com/",
            },
        ],
    },
    {
        name: "Biswajit Jena",
        title: "Faculty",
        summary: "Lead backend dev at Clearbit. Former Clearbit and Loom.",
        avatarUrl: "/Facutly/image2.png",
        socials: [
            {
                icon: X,
                href: "https://x.com/",
            },
            {
                icon: LinkedIn,
                href: "https://www.linkedin.com/",
            },
            {
                icon: DribbbleIcon,
                href: "https://dribbble.com/",
            },
        ],
    },
    {
        name: "Koushik Mohanty",
        title: "Project Associaate",
        summary: "Founding design team at Figma. Former Pleo, Stripe, and Tile.",
        avatarUrl: "/Facutly/image2.png",
        socials: [
            {
                icon: X,
                href: "https://x.com/",
            },
            {
                icon: LinkedIn,
                href: "https://www.linkedin.com/",
            },
            {
                icon: DribbbleIcon,
                href: "https://dribbble.com/",
            },
        ],
    },

];

const TeamSectionSimple01 = () => {
    const mainMember = teamMembers[0];
    const otherMembers = teamMembers.slice(1);

    return (
        <section className="bg-transparent py-16 md:py-24">
            <div className="mx-auto max-w-container px-4 md:px-8">
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
                    <span className="text-sm font-semibold text-muted-foreground md:text-base"></span>
                    <h2 className="mt-3 text-4xl font-semibold text-foreground md:text-5xl">Meet our Faculty</h2>
                    <p className="mt-4 text-lg text-muted-foreground md:mt-5 md:text-xl">
                        Our faculty consists of leading experts in UAV technology, aerodynamics, and robotics, dedicated to advancing research and fostering the next generation of drone innovators.
                    </p>
                </div>

                <div className="mt-12 md:mt-20 flex flex-col items-center gap-16 md:gap-20">
                    {/* Main Member (Anil kumar shaw) */}
                    {mainMember && (
                        <div className="flex flex-col items-center gap-5 md:gap-6">
                            <Avatar src={mainMember.avatarUrl} alt={mainMember.name} className="h-32 w-32 md:h-48 md:w-48 border-none" />
                            <div className="text-center">
                                <h3 className="text-2xl md:text-3xl font-semibold text-foreground">{mainMember.name}</h3>
                                <p className="text-lg md:text-xl text-muted-foreground mt-1">{mainMember.title}</p>
                            </div>
                        </div>
                    )}

                    {/* Other Members */}
                    {otherMembers.length > 0 && (
                        <ul className="grid w-full max-w-6xl grid-cols-1 justify-items-center gap-x-8 gap-y-16 sm:grid-cols-3">
                            {otherMembers.map((item) => (
                                <li key={item.title} className="flex flex-col items-center gap-4 md:gap-5">
                                    <Avatar src={item.avatarUrl} alt={item.name} className="h-28 w-28 md:h-36 md:w-36 border-none" />
                                    <div className="text-center">
                                        <h3 className="text-xl md:text-2xl font-semibold text-foreground">{item.name}</h3>
                                        <p className="text-base md:text-lg text-muted-foreground mt-1">{item.title}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
};

export function FacultyPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-transparent text-foreground flex flex-col">
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
                    className="bg-[#050510]/70 backdrop-blur-lg text-white flex justify-between items-center px-7 py-2"
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

            <main className="flex-1">
                <TeamSectionSimple01 />
            </main>

            <Footer />
        </div>
    );
}
