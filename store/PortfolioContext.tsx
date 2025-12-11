import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import {
    PortfolioData,
    Project,
    Skill,
    Profile,
    PortfolioContextType,
} from "../types";

const defaultData: PortfolioData = {
    profile: {
        name: "Jahedul Islam Jishan",
        title: "Full Stack Developer",
        bio: "I am a 3rd-year student at Jagannath University, Dhaka (IER). I specialize in building scalable web applications using the MERN stack, Golang, and cloud technologies like Docker and AWS.",
        email: "contact@jahedulislam.dev",
        socials: {
            github: "https://github.com/jahedulislamdev",
            linkedin: "https://www.linkedin.com/in/jahedulislamdev",
            twitter: "",
        },
    },
    projects: [
        {
            id: "1",
            title: "Sharevite",
            description:
                "A modern social platform for connecting people and sharing moments. Built for high performance and real-time interaction.",
            imageUrl:
                "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
            tags: ["React", "Firebase", "TailwindCSS"],
            link: "https://sharevite-2ccb7.web.app/",
        },
        {
            id: "2",
            title: "Cartique",
            description:
                "A comprehensive e-commerce solution featuring secure authentication, cart management, and a seamless checkout experience.",
            imageUrl:
                "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=800&q=80",
            tags: ["React", "Firebase", "Stripe"],
            link: "https://cartique-auth.web.app/",
        },
        {
            id: "3",
            title: "Vehicle Rental System",
            description:
                "Robust backend system for managing vehicle rentals, including inventory tracking, booking logic, and user management.",
            imageUrl:
                "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
            tags: ["Node.js", "MongoDB", "Express.js"],
            link: "https://github.com/jahedulislamdev/Vehicle-Rental-System_A2",
        },
    ],
    skills: [
        { id: "1", name: "JavaScript / TypeScript", level: 90 },
        { id: "2", name: "Node.js & Express", level: 85 },
        { id: "3", name: "Golang", level: 75 },
        { id: "4", name: "React", level: 90 },
        { id: "5", name: "MongoDB & PostgreSQL", level: 80 },
        { id: "6", name: "Docker & AWS", level: 70 },
        { id: "7", name: "Firebase", level: 85 },
        { id: "8", name: "TailwindCSS & Bootstrap", level: 95 },
        { id: "9", name: "Nginx", level: 60 },
    ],
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(
    undefined,
);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [data, setData] = useState<PortfolioData>(() => {
        const saved = localStorage.getItem("portfolioData");
        return saved ? JSON.parse(saved) : defaultData;
    });

    useEffect(() => {
        localStorage.setItem("portfolioData", JSON.stringify(data));
    }, [data]);

    const updateProfile = (profile: Profile) => {
        setData((prev) => ({ ...prev, profile }));
    };

    const addProject = (project: Project) => {
        setData((prev) => ({ ...prev, projects: [...prev.projects, project] }));
    };

    const updateProject = (project: Project) => {
        setData((prev) => ({
            ...prev,
            projects: prev.projects.map((p) =>
                p.id === project.id ? project : p,
            ),
        }));
    };

    const deleteProject = (id: string) => {
        setData((prev) => ({
            ...prev,
            projects: prev.projects.filter((p) => p.id !== id),
        }));
    };

    const addSkill = (skill: Skill) => {
        setData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    };

    const updateSkill = (skill: Skill) => {
        setData((prev) => ({
            ...prev,
            skills: prev.skills.map((s) => (s.id === skill.id ? skill : s)),
        }));
    };

    const deleteSkill = (id: string) => {
        setData((prev) => ({
            ...prev,
            skills: prev.skills.filter((s) => s.id !== id),
        }));
    };

    const resetData = () => {
        setData(defaultData);
    };

    return (
        <PortfolioContext.Provider
            value={{
                data,
                updateProfile,
                addProject,
                updateProject,
                deleteProject,
                addSkill,
                updateSkill,
                deleteSkill,
                resetData,
            }}
        >
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolio = () => {
    const context = useContext(PortfolioContext);
    if (!context) {
        throw new Error("usePortfolio must be used within a PortfolioProvider");
    }
    return context;
};
