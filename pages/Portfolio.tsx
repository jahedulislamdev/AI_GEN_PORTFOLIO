import React, { useState, useEffect } from "react";
import { usePortfolio } from "../store/PortfolioContext";
import { motion } from "framer-motion";
import {
    Github,
    Twitter,
    Linkedin,
    Mail,
    ExternalLink,
    Code2,
    ArrowRight,
} from "lucide-react";

// Cast motion components to any to resolve TypeScript errors
const MotionSection = motion.section as any;
const MotionDiv = motion.div as any;
const MotionH1 = motion.h1 as any;
const MotionH2 = motion.h2 as any;
const MotionP = motion.p as any;

const TypewriterText: React.FC<{ text: string; delay?: number }> = ({
    text,
    delay = 0,
}) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let currentIndex = 0;
        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                if (currentIndex <= text.length) {
                    setDisplayedText(text.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(interval);
                }
            }, 50);
            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(timeout);
    }, [text, delay]);

    return <span>{displayedText}</span>;
};

const Portfolio: React.FC = () => {
    const { data } = usePortfolio();
    const { profile, projects, skills } = data;

    // New "Reveal" variants for a more premium look
    const revealVariants = {
        hidden: { y: "100%" },
        visible: {
            y: 0,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
        },
    };

    const maskContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const projectCardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
        hover: {
            y: -12,
            transition: { type: "spring", stiffness: 300, damping: 20 },
        },
    };

    const skillCardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 100 },
        },
        hover: {
            scale: 1.05,
            y: -5,
            borderColor: "#a18072",
            transition: { duration: 0.2 },
        },
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 lg:py-24">
            {/* Hero Section */}
            <MotionSection
                initial="hidden"
                animate="visible"
                variants={maskContainer}
                className="flex flex-col items-start justify-center min-h-[85vh] relative"
            >
                <div className="overflow-hidden mb-6">
                    <MotionDiv
                        variants={revealVariants}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold tracking-wider text-cozy-800 bg-white border border-cozy-200 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-default"
                    >
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        AVAILABLE FOR WORK
                    </MotionDiv>
                </div>

                <div className="overflow-hidden mb-2">
                    <MotionH1
                        variants={revealVariants}
                        className="text-6xl md:text-8xl font-black text-cozy-900 tracking-tighter leading-none"
                    >
                        Hi, I'm{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cozy-600 to-cozy-400">
                            {profile.name.split(" ")[0]}
                        </span>
                        .
                    </MotionH1>
                </div>

                <div className="overflow-hidden mb-8 h-12 flex items-center">
                    <MotionH2
                        variants={revealVariants}
                        className="text-2xl md:text-4xl text-cozy-500 font-medium flex items-center"
                    >
                        <span className="mr-2">I am a</span>
                        <span className="font-bold text-cozy-800 border-b-2 border-cozy-400">
                            <TypewriterText text={profile.title} delay={1200} />
                        </span>
                        <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="inline-block w-1 h-8 bg-cozy-800 ml-1 align-middle"
                        />
                    </MotionH2>
                </div>

                <div className="overflow-hidden mb-10">
                    <MotionP
                        variants={revealVariants}
                        className="text-xl text-cozy-700 max-w-2xl leading-relaxed font-light"
                    >
                        {profile.bio}
                    </MotionP>
                </div>

                <MotionDiv
                    variants={revealVariants}
                    className="flex flex-wrap gap-4"
                >
                    <a
                        href={`mailto:${profile.email}`}
                        className="group px-8 py-4 bg-cozy-900 text-white rounded-2xl font-bold shadow-lg shadow-cozy-900/20 hover:bg-black transition-all transform hover:-translate-y-1 flex items-center gap-2"
                    >
                        <Mail
                            size={20}
                            className="group-hover:rotate-12 transition-transform"
                        />{" "}
                        Let's Connect
                    </a>
                    <div className="flex gap-3 items-center px-4">
                        {profile.socials.github && (
                            <a
                                href={profile.socials.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-xl bg-white border border-cozy-200 text-cozy-600 hover:text-cozy-900 hover:border-cozy-400 transition-all hover:-translate-y-1 hover:shadow-md"
                            >
                                <Github size={24} />
                            </a>
                        )}
                        {profile.socials.linkedin && (
                            <a
                                href={profile.socials.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-xl bg-white border border-cozy-200 text-cozy-600 hover:text-cozy-900 hover:border-cozy-400 transition-all hover:-translate-y-1 hover:shadow-md"
                            >
                                <Linkedin size={24} />
                            </a>
                        )}
                        {profile.socials.twitter && (
                            <a
                                href={profile.socials.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-xl bg-white border border-cozy-200 text-cozy-600 hover:text-cozy-900 hover:border-cozy-400 transition-all hover:-translate-y-1 hover:shadow-md"
                            >
                                <Twitter size={24} />
                            </a>
                        )}
                    </div>
                </MotionDiv>
            </MotionSection>

            {/* Projects Section */}
            <section className="py-20">
                <MotionDiv
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-end gap-6 mb-16"
                >
                    <h3 className="text-4xl md:text-5xl font-black text-cozy-900">
                        Featured
                        <br />
                        <span className="text-cozy-400">Projects</span>
                    </h3>
                    <div className="h-2 w-24 bg-gradient-to-r from-cozy-400 to-cozy-600 mb-4 rounded-full"></div>
                </MotionDiv>

                <MotionDiv
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.15 } },
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {projects.map((project) => (
                        <MotionDiv
                            key={project.id}
                            variants={projectCardVariants}
                            whileHover="hover"
                            className="group bg-white rounded-[2rem] overflow-hidden shadow-sm border border-cozy-100 flex flex-col h-full cursor-pointer relative"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={project.imageUrl}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-cozy-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                                    <span className="text-white font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                                        View Project
                                    </span>
                                </div>
                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm text-cozy-900 rounded-full opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 hover:bg-white"
                                    >
                                        <ExternalLink size={20} />
                                    </a>
                                )}
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <h4 className="text-2xl font-bold text-cozy-900 mb-3 group-hover:text-cozy-600 transition-colors">
                                    {project.title}
                                </h4>
                                <p className="text-cozy-600 mb-6 leading-relaxed text-sm flex-1">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2 pt-4 border-t border-cozy-100">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-cozy-50 text-cozy-700 text-xs font-bold uppercase tracking-wider rounded-lg"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </MotionDiv>
                    ))}
                </MotionDiv>
            </section>

            {/* Skills Section */}
            <section className="py-20">
                <MotionDiv
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-end gap-6 mb-16"
                >
                    <h3 className="text-4xl md:text-5xl font-black text-cozy-900">
                        Technical
                        <br />
                        <span className="text-cozy-400">Proficiency</span>
                    </h3>
                    <div className="h-2 w-24 bg-gradient-to-r from-cozy-400 to-cozy-600 mb-4 rounded-full"></div>
                </MotionDiv>

                <MotionDiv
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } },
                    }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                    {skills.map((skill) => (
                        <MotionDiv
                            key={skill.id}
                            variants={skillCardVariants}
                            whileHover="hover"
                            className="bg-white p-5 rounded-2xl border border-cozy-100 shadow-sm flex flex-col justify-between h-32 cursor-default group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-cozy-50 rounded-lg text-cozy-600 group-hover:bg-cozy-600 group-hover:text-white transition-colors">
                                    <Code2 size={20} />
                                </div>
                                <span className="text-xl font-bold text-cozy-200 group-hover:text-cozy-400 transition-colors">
                                    {skill.level}%
                                </span>
                            </div>
                            <div>
                                <h5 className="font-bold text-cozy-800 text-lg leading-tight group-hover:translate-x-1 transition-transform">
                                    {skill.name}
                                </h5>
                                <div className="w-full bg-cozy-50 h-1.5 rounded-full mt-3 overflow-hidden">
                                    <MotionDiv
                                        initial={{ width: 0 }}
                                        whileInView={{
                                            width: `${skill.level}%`,
                                        }}
                                        transition={{
                                            duration: 1.2,
                                            ease: "easeOut",
                                            delay: 0.2,
                                        }}
                                        className="bg-cozy-500 h-full rounded-full"
                                    ></MotionDiv>
                                </div>
                            </div>
                        </MotionDiv>
                    ))}
                </MotionDiv>
            </section>

            <footer className="py-12 mt-12 border-t border-cozy-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-cozy-900">
                            {profile.name}
                        </h2>
                        <p className="text-cozy-500">
                            Building the future, one line of code at a time.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <p className="text-cozy-400 text-sm">
                            © {new Date().getFullYear()} All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Portfolio;
