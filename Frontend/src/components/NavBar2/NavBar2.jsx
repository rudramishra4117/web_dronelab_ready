import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  MenuIcon,
  ChevronDown,
  ArrowRight,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { MdElectricBolt } from "react-icons/md";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getServices } from "../../api/axios";

// ── Menu definition — Virtual Tour is separated as a CTA button ──
const mainMenu = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Bootcamp",
    url: "/bootcamp",
  },
  {
    title: "Resources",
    url: "/resources",
  },
  {
    title: "Services",
    url: "/services",
    description:
      "Access our cutting-edge drone and aerospace service offerings. From 3D modelling and design to rapid prototyping, explore tools built for engineers, researchers, and innovators.",
    subMenu: [
      {
        title: "Try 3D CAD",
        url: "/services/try-3d-cad",
      },
      {
        title: "Simulation",
        url: "/services/simulation",
      },
      {
        title: "Tool Box",
        url: "/services/toolbox",
      },
    ],
  },
  {
    title: "PoC",
    url: "/poc",
    description:
      "Access valuable insights, technical knowledge, and updates from the world of UAV technology and engineering. Our publications include articles, guides, and research to support students, researchers, and professionals.",
    subMenu: [], // This will be populated dynamically
  },
  {
    title: "About Us",
    url: "/about",
    description:
      "Discover the people, passion, and purpose behind our drone lab. Learn about our journey, meet the faculty driving innovation, take a virtual tour of our facilities, or reach out to collaborate.",
    subMenu: [
      {
        title: "Our Story",
        url: "/about/story",
      },
      {
        title: "Faculty",
        url: "/about/faculty",
      },
      {
        title: "Contact",
        url: "/contact",
      },
    ],
  },
  {
    title: "Admin",
    url: "http://127.0.0.1:8000/admin/",
    isExternal: true,
  },
];

// ── Main NavBar2 Component ──

export function NavBar2(navBar2Props) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState(null);
  const closeTimeoutRef = React.useRef(null);
  const navRef = React.useRef(null);
  const navigate = useNavigate();

  const {
    domain = { name: "Bolt Stack" },
    isSticky = true,
    leftAddon,
    className = "",
    navigationMenu,
    ...props
  } = navBar2Props;

  const defaultLogo = domain.logo || <MdElectricBolt size={26} />;
  const [isClient, setIsClient] = React.useState(false);
  const [servicesData, setServicesData] = React.useState([]);
  const [pocData, setPocData] = React.useState([]);

  React.useEffect(() => {
    setIsClient(true);
    getServices()
      .then((res) => setServicesData(res.data))
      .catch((err) => console.error("Failed to fetch services in NavBar2", err));
    
    import("../../api/axios").then(({ getPocs }) => {
      getPocs()
        .then((res) => setPocData(res.data))
        .catch((err) => console.error("Failed to fetch PoCs in NavBar2", err));
    });
  }, []);

  const defaultNavigationMenu = React.useMemo(() => {
    const menu = [...(navigationMenu ?? mainMenu)];
    
    const servicesIndex = menu.findIndex((m) => m.title === "Services");
    if (servicesIndex !== -1 && servicesData.length > 0) {
      menu[servicesIndex] = {
        ...menu[servicesIndex],
        subMenu: servicesData.map((s) => ({
          title: s.title,
          url: s.url,
          isExternal: s.is_external,
        })),
      };
    }
    
    const pocIndex = menu.findIndex((m) => m.title === "PoC");
    if (pocIndex !== -1 && pocData.length > 0) {
      menu[pocIndex] = {
        ...menu[pocIndex],
        subMenu: pocData.map((poc, index) => ({
          title: poc.navbar_name || `PoC ${index + 1}`,
          url: `/poc/${poc.id}`,
        })),
      };
    }
    
    return menu;
  }, [navigationMenu, servicesData, pocData]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isClient]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = (title) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(title);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleDropdownMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleDropdownMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const navBarStickyClass = `
    sticky top-0 z-50 transition-all duration-300
    bg-slate-900 text-white
    dark:bg-transparent dark:text-inherit
    ${isScrolled ? "dark:bg-opacity-30 dark:backdrop-blur-lg shadow-lg dark:border-b" : ""}
  `;

  if (!isClient) return null;

  const activeMenu = defaultNavigationMenu.find(
    (item) => item.title === activeDropdown && item.subMenu
  );

  return (
    <div ref={navRef} className={`relative ${isSticky ? navBarStickyClass : ""} ${className}`}>
      <nav
        {...props}
        className="w-full flex items-center justify-between px-8 py-4"
      >
        {/* Logo — pinned to the left */}
        <Link to="/" className="flex-shrink-0">
          <div className="flex items-center gap-2.5">
            {defaultLogo}
            {typeof domain.name === "string" ? (
              <div className="flex flex-col leading-tight max-md:hidden">
                <span className="text-[18px] font-bold tracking-wide whitespace-nowrap leading-snug">
                  {domain.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">{domain.name}</div>
            )}
          </div>
        </Link>

        {/* All other elements — grouped on the right */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Desktop Navigation */}
          <ul className="max-lg:hidden flex items-center gap-1 list-none m-0 p-0">
            {defaultNavigationMenu.map((menuItem) => {
              const hasDropdown = menuItem.subMenu && menuItem.subMenu.length > 0;
              const isActive = activeDropdown === menuItem.title;

              return (
                <li
                  key={menuItem.title}
                  className="relative"
                  onMouseEnter={() => hasDropdown && handleMouseEnter(menuItem.title)}
                  onMouseLeave={() => hasDropdown && handleMouseLeave()}
                >
                  {hasDropdown ? (
                    <button
                      className={`flex items-center gap-1 px-3 py-2 text-[15px] font-medium rounded-md 
                        transition-colors cursor-pointer bg-transparent border-none outline-none whitespace-nowrap
                        hover:bg-white/10 dark:hover:bg-accent hover:text-white dark:hover:text-accent-foreground
                        ${isActive ? "text-primary bg-white/5" : "text-inherit"}`}
                      onClick={() => setActiveDropdown(isActive ? null : menuItem.title)}
                    >
                      {menuItem.title}
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${isActive ? "rotate-180" : ""}`}
                      />
                    </button>
                  ) : menuItem.isExternal ? (
                    <a
                      href={menuItem.url}
                      className="px-3 py-2 text-[15px] font-medium rounded-md transition-colors whitespace-nowrap
                        hover:bg-white/10 dark:hover:bg-accent hover:text-white dark:hover:text-accent-foreground text-inherit no-underline"
                    >
                      {menuItem.title}
                    </a>
                  ) : (
                    <Link
                      to={menuItem.url}
                      className="px-3 py-2 text-[15px] font-medium rounded-md transition-colors whitespace-nowrap
                        hover:bg-white/10 dark:hover:bg-accent hover:text-white dark:hover:text-accent-foreground text-inherit no-underline"
                    >
                      {menuItem.title}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* ── Virtual Tour CTA Button ── */}
          <Link
            to="/about/tour"
            className="max-lg:hidden flex items-center gap-2 px-4 py-2 rounded-md text-[15px] font-semibold whitespace-nowrap no-underline
              bg-gradient-to-r from-sky-500 to-blue-600 text-white
              hover:from-sky-400 hover:to-blue-500
              shadow-md shadow-sky-900/40
              transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Video size={16} strokeWidth={2.5} />
            Virtual Tour
          </Link>

          {/* Right side addons */}
          <div className="flex-shrink-0 flex items-center gap-2">
            {leftAddon && (
              <div className="max-lg:hidden flex items-center gap-2">
                {leftAddon}
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="hidden max-lg:block">
                <Button variant="outline">
                  <MenuIcon />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-[#050510] text-white border-zinc-800">
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-start gap-2 text-white">
                    {React.isValidElement(defaultLogo)
                      ? React.cloneElement(defaultLogo)
                      : defaultLogo}
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-20">
                  {/* Virtual Tour mobile button */}
                  <Link
                    to="/about/tour"
                    className="flex items-center gap-2 mb-4 px-4 py-3 rounded-lg text-sm font-semibold no-underline
                      bg-gradient-to-r from-sky-500 to-blue-600 text-white"
                  >
                    <Video size={15} />
                    Virtual Tour
                  </Link>

                  <Accordion type="single" collapsible>
                    {defaultNavigationMenu.map((mainMenuItem) => {
                      if (mainMenuItem.subMenu && mainMenuItem.subMenu.length > 0) {
                        return (
                          <AccordionItem
                            key={mainMenuItem.title}
                            value={mainMenuItem.title}
                            className="border-none"
                          >
                            <AccordionTrigger className="text-left font-medium text-white hover:text-gray-300">
                              {mainMenuItem.title}
                            </AccordionTrigger>
                            <AccordionContent className="pb-4">
                              <div className="space-y-2">
                                {mainMenuItem.subMenu.map((subMenuItem) => (
                                  <Link
                                    key={subMenuItem.title}
                                    to={subMenuItem.url || ""}
                                    className="p-2 flex items-center gap-4 rounded-md hover:bg-white/10 text-white text-sm no-underline"
                                  >
                                    <div>
                                      <div className="font-medium">
                                        {subMenuItem.title}
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      }

                      return (
                        <div key={mainMenuItem.title}>
                          {mainMenuItem.isExternal ? (
                            <a
                              href={mainMenuItem.url}
                              className="block py-4 font-medium text-white hover:text-gray-300 no-underline"
                            >
                              {mainMenuItem.title}
                            </a>
                          ) : (
                            <Link
                              to={mainMenuItem.url}
                              className="block py-4 font-medium text-white hover:text-gray-300 no-underline"
                            >
                              {mainMenuItem.title}
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </Accordion>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ── Full-width Mega Menu Dropdown Panel ── */}
      {activeMenu && (
        <div
          className="absolute left-0 right-0 top-[80px] z-40 bg-popover border-t border-b shadow-lg
            animate-in fade-in slide-in-from-top-2 duration-200"
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          <div className="max-w-screen-xl mx-auto px-12 py-8 flex gap-16">
            {/* Left — Section title + description */}
            <div className="flex-1 max-w-lg">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                {activeMenu.title}
              </h3>
              <div className="mt-3 mb-4 h-[2.5px] w-12 bg-primary rounded-full" />
              {activeMenu.description && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {activeMenu.description}
                </p>
              )}
            </div>

            {/* Right — Links list */}
            <div className="flex flex-col gap-1 min-w-[200px] pt-1">
              {activeMenu.subMenu.map((subMenuItem) => (
                subMenuItem.isExternal ? (
                  <a
                    key={subMenuItem.title}
                    href={subMenuItem.url}
                    onClick={() => setActiveDropdown(null)}
                    className="group flex items-center gap-3 py-2 text-[14px] font-medium
                      text-foreground no-underline transition-colors hover:text-primary"
                  >
                    <span>{subMenuItem.title}</span>
                    <ArrowRight
                      size={14}
                      className="text-muted-foreground opacity-0 -translate-x-2 
                        transition-all duration-200
                        group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary"
                    />
                  </a>
                ) : (
                  <Link
                    key={subMenuItem.title}
                    to={subMenuItem.url || ""}
                    onClick={() => setActiveDropdown(null)}
                    className="group flex items-center gap-3 py-2 text-[14px] font-medium
                      text-foreground no-underline transition-colors hover:text-primary"
                  >
                    <span>{subMenuItem.title}</span>
                    <ArrowRight
                      size={14}
                      className="text-muted-foreground opacity-0 -translate-x-2 
                        transition-all duration-200
                        group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary"
                    />
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar2;
