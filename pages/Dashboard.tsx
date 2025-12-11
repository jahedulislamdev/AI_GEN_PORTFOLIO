import React, { useState, useEffect } from "react";
import { usePortfolio } from "../store/PortfolioContext";
import { enhanceContent, generateSkillList } from "../services/geminiService";
import {
    Sparkles,
    Plus,
    Trash2,
    Loader2,
    Download,
    Lock,
    Key,
    Unlock,
} from "lucide-react";
import { Project } from "../types";
import { motion } from "framer-motion";

// Cast motion to any for strict TS environments
const MotionDiv = motion.div as any;
const MotionForm = motion.form as any;

const Dashboard: React.FC = () => {
    const {
        data,
        updateProfile,
        addProject,
        deleteProject,
        addSkill,
        deleteSkill,
    } = usePortfolio();
    const [activeTab, setActiveTab] = useState<
        "profile" | "projects" | "skills"
    >("profile");

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [authError, setAuthError] = useState(false);

    // Loading states
    const [isGeneratingBio, setIsGeneratingBio] = useState(false);
    const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);

    // Local state for editing projects
    const [newProject, setNewProject] = useState<Partial<Project>>({
        title: "",
        description: "",
        tags: [],
        imageUrl: "",
    });
    const [newSkill, setNewSkill] = useState<string>("");

    useEffect(() => {
        // Check session storage to keep user logged in during session
        const sessionAuth = sessionStorage.getItem("is_admin_authenticated");
        if (sessionAuth === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, use environment variables. Default is 'admin123'
        const correctPassword = process.env.ADMIN_PASSWORD || "admin123";

        if (passwordInput === correctPassword) {
            setIsAuthenticated(true);
            sessionStorage.setItem("is_admin_authenticated", "true");
            setAuthError(false);
        } else {
            setAuthError(true);
            // Shake animation trigger logic could go here
        }
    };

    const handleEnhanceBio = async () => {
        setIsGeneratingBio(true);
        const newBio = await enhanceContent(data.profile.bio, "bio");
        updateProfile({ ...data.profile, bio: newBio });
        setIsGeneratingBio(false);
    };

    const handleGenerateSkills = async () => {
        if (!data.profile.title) return;
        setIsGeneratingSkills(true);
        const suggestions = await generateSkillList(data.profile.title);
        suggestions.forEach((skillName) => {
            if (
                !data.skills.find(
                    (s) => s.name.toLowerCase() === skillName.toLowerCase(),
                )
            ) {
                addSkill({
                    id: Date.now().toString() + Math.random(),
                    name: skillName,
                    level: 70,
                });
            }
        });
        setIsGeneratingSkills(false);
    };

    const handleAddProject = () => {
        if (!newProject.title || !newProject.description) return;
        const project: Project = {
            id: Date.now().toString(),
            title: newProject.title,
            description: newProject.description,
            imageUrl:
                newProject.imageUrl ||
                `https://picsum.photos/seed/${Date.now()}/800/600`,
            tags: newProject.tags || [],
            link: newProject.link,
        };
        addProject(project);
        setNewProject({ title: "", description: "", tags: [], imageUrl: "" });
    };

    const handleAddSkill = () => {
        if (!newSkill) return;
        addSkill({ id: Date.now().toString(), name: newSkill, level: 80 });
        setNewSkill("");
    };

    const handleExportData = () => {
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "portfolio-data.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // --- LOGIN SCREEN ---
    if (!isAuthenticated) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <MotionDiv
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="bg-white p-8 rounded-3xl shadow-xl border border-cozy-100 max-w-md w-full text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cozy-400 to-cozy-600"></div>
                    <div className="mb-6 flex justify-center">
                        <div className="p-4 bg-cozy-50 rounded-full text-cozy-600">
                            <Lock size={32} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-cozy-900 mb-2">
                        Restricted Access
                    </h2>
                    <p className="text-cozy-500 mb-8">
                        Please enter the admin password to manage the portfolio.
                    </p>

                    <MotionForm onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <Key
                                className="absolute left-4 top-3.5 text-cozy-400"
                                size={18}
                            />
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) =>
                                    setPasswordInput(e.target.value)
                                }
                                placeholder="Enter Password"
                                className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                                    authError
                                        ? "border-red-300 bg-red-50"
                                        : "border-cozy-200 bg-cozy-50"
                                } focus:outline-none focus:ring-2 focus:ring-cozy-400 transition-all`}
                            />
                        </div>
                        {authError && (
                            <p className="text-red-500 text-sm font-bold">
                                Incorrect password
                            </p>
                        )}
                        <button
                            type="submit"
                            className="w-full py-3 bg-cozy-900 text-white rounded-xl font-bold hover:bg-black transition-all flex justify-center items-center gap-2"
                        >
                            <Unlock size={18} /> Access Dashboard
                        </button>
                    </MotionForm>
                    <p className="mt-6 text-xs text-cozy-300 uppercase tracking-widest font-bold">
                        Secure Area
                    </p>
                </MotionDiv>
            </div>
        );
    }

    // --- DASHBOARD CONTENT ---
    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center mb-10"
            >
                <h1 className="text-3xl font-bold text-cozy-900 flex items-center gap-3">
                    Dashboard{" "}
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full border border-green-200">
                        Authenticated
                    </span>
                </h1>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportData}
                        className="text-sm text-cozy-700 hover:text-cozy-900 flex items-center gap-2 font-semibold px-4 py-2 bg-white border border-cozy-200 rounded-lg hover:bg-cozy-50 transition-colors shadow-sm"
                    >
                        <Download size={16} /> Export Data
                    </button>
                    <button
                        onClick={() => {
                            setIsAuthenticated(false);
                            sessionStorage.removeItem("is_admin_authenticated");
                        }}
                        className="text-sm text-cozy-500 hover:text-cozy-800 font-bold px-4 py-2 hover:bg-cozy-100 rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </MotionDiv>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1 space-y-2">
                    {["profile", "projects", "skills"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`w-full text-left px-6 py-4 rounded-xl font-semibold transition-all ${
                                activeTab === tab
                                    ? "bg-white text-cozy-800 shadow-md border-l-4 border-cozy-500"
                                    : "text-cozy-500 hover:bg-cozy-100"
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <MotionDiv
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-3xl p-8 shadow-sm border border-cozy-100"
                    >
                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-cozy-600 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.profile.name}
                                            onChange={(e) =>
                                                updateProfile({
                                                    ...data.profile,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-3 rounded-xl bg-cozy-50 border border-cozy-200 focus:outline-none focus:ring-2 focus:ring-cozy-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-cozy-600 mb-2">
                                            Job Title
                                        </label>
                                        <input
                                            type="text"
                                            value={data.profile.title}
                                            onChange={(e) =>
                                                updateProfile({
                                                    ...data.profile,
                                                    title: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-3 rounded-xl bg-cozy-50 border border-cozy-200 focus:outline-none focus:ring-2 focus:ring-cozy-300"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-bold text-cozy-600">
                                            Bio
                                        </label>
                                        <button
                                            onClick={handleEnhanceBio}
                                            disabled={isGeneratingBio}
                                            className="flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-700 disabled:opacity-50"
                                        >
                                            {isGeneratingBio ? (
                                                <Loader2
                                                    size={12}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Sparkles size={12} />
                                            )}
                                            AI Enhance
                                        </button>
                                    </div>
                                    <textarea
                                        value={data.profile.bio}
                                        onChange={(e) =>
                                            updateProfile({
                                                ...data.profile,
                                                bio: e.target.value,
                                            })
                                        }
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl bg-cozy-50 border border-cozy-200 focus:outline-none focus:ring-2 focus:ring-cozy-300 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-cozy-600 mb-2">
                                            GitHub URL
                                        </label>
                                        <input
                                            type="text"
                                            value={
                                                data.profile.socials.github ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                updateProfile({
                                                    ...data.profile,
                                                    socials: {
                                                        ...data.profile.socials,
                                                        github: e.target.value,
                                                    },
                                                })
                                            }
                                            className="w-full px-4 py-3 rounded-xl bg-cozy-50 border border-cozy-200 focus:outline-none focus:ring-2 focus:ring-cozy-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-cozy-600 mb-2">
                                            Twitter URL
                                        </label>
                                        <input
                                            type="text"
                                            value={
                                                data.profile.socials.twitter ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                updateProfile({
                                                    ...data.profile,
                                                    socials: {
                                                        ...data.profile.socials,
                                                        twitter: e.target.value,
                                                    },
                                                })
                                            }
                                            className="w-full px-4 py-3 rounded-xl bg-cozy-50 border border-cozy-200 focus:outline-none focus:ring-2 focus:ring-cozy-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-cozy-600 mb-2">
                                            LinkedIn URL
                                        </label>
                                        <input
                                            type="text"
                                            value={
                                                data.profile.socials.linkedin ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                updateProfile({
                                                    ...data.profile,
                                                    socials: {
                                                        ...data.profile.socials,
                                                        linkedin:
                                                            e.target.value,
                                                    },
                                                })
                                            }
                                            className="w-full px-4 py-3 rounded-xl bg-cozy-50 border border-cozy-200 focus:outline-none focus:ring-2 focus:ring-cozy-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Projects Tab */}
                        {activeTab === "projects" && (
                            <div className="space-y-8">
                                {/* Add Project Form */}
                                <div className="bg-cozy-50 p-6 rounded-2xl border border-cozy-200">
                                    <h3 className="text-lg font-bold text-cozy-800 mb-4">
                                        Add New Project
                                    </h3>
                                    <div className="space-y-4">
                                        <input
                                            placeholder="Project Title"
                                            value={newProject.title}
                                            onChange={(e) =>
                                                setNewProject({
                                                    ...newProject,
                                                    title: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2 rounded-lg border border-cozy-200 focus:outline-none"
                                        />
                                        <div className="relative">
                                            <textarea
                                                placeholder="Description"
                                                value={newProject.description}
                                                onChange={(e) =>
                                                    setNewProject({
                                                        ...newProject,
                                                        description:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-2 rounded-lg border border-cozy-200 focus:outline-none resize-none h-24"
                                            />
                                            <button
                                                onClick={async () => {
                                                    if (
                                                        newProject.description
                                                    ) {
                                                        const improved =
                                                            await enhanceContent(
                                                                newProject.description,
                                                                "project",
                                                            );
                                                        setNewProject({
                                                            ...newProject,
                                                            description:
                                                                improved,
                                                        });
                                                    }
                                                }}
                                                className="absolute bottom-2 right-2 p-1 text-indigo-500 bg-white rounded-full shadow-sm hover:bg-indigo-50"
                                                title="AI Enhance Description"
                                            >
                                                <Sparkles size={14} />
                                            </button>
                                        </div>

                                        <div className="flex gap-2">
                                            <input
                                                placeholder="Tags (comma separated)"
                                                value={newProject.tags?.join(
                                                    ", ",
                                                )}
                                                onChange={(e) =>
                                                    setNewProject({
                                                        ...newProject,
                                                        tags: e.target.value
                                                            .split(",")
                                                            .map((t) =>
                                                                t.trim(),
                                                            ),
                                                    })
                                                }
                                                className="flex-1 px-4 py-2 rounded-lg border border-cozy-200 focus:outline-none"
                                            />
                                            <input
                                                placeholder="Image URL (optional)"
                                                value={newProject.imageUrl}
                                                onChange={(e) =>
                                                    setNewProject({
                                                        ...newProject,
                                                        imageUrl:
                                                            e.target.value,
                                                    })
                                                }
                                                className="flex-1 px-4 py-2 rounded-lg border border-cozy-200 focus:outline-none"
                                            />
                                        </div>

                                        <button
                                            onClick={handleAddProject}
                                            className="w-full py-3 bg-cozy-800 text-white rounded-xl font-bold hover:bg-cozy-900 transition-colors flex justify-center items-center gap-2"
                                        >
                                            <Plus size={18} /> Add Project
                                        </button>
                                    </div>
                                </div>

                                {/* Project List */}
                                <div className="space-y-4">
                                    {data.projects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="flex items-center justify-between p-4 bg-white border border-cozy-100 rounded-xl hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={project.imageUrl}
                                                    alt=""
                                                    className="w-16 h-16 rounded-lg object-cover bg-cozy-100"
                                                />
                                                <div>
                                                    <h4 className="font-bold text-cozy-800">
                                                        {project.title}
                                                    </h4>
                                                    <p className="text-sm text-cozy-500 truncate max-w-xs">
                                                        {project.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    deleteProject(project.id)
                                                }
                                                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Skills Tab */}
                        {activeTab === "skills" && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 flex gap-2">
                                        <input
                                            value={newSkill}
                                            onChange={(e) =>
                                                setNewSkill(e.target.value)
                                            }
                                            placeholder="Add a skill (e.g. React)"
                                            className="flex-1 px-4 py-3 rounded-xl bg-cozy-50 border border-cozy-200 focus:outline-none"
                                            onKeyDown={(e) =>
                                                e.key === "Enter" &&
                                                handleAddSkill()
                                            }
                                        />
                                        <button
                                            onClick={handleAddSkill}
                                            className="px-6 bg-cozy-800 text-white rounded-xl font-bold hover:bg-cozy-900"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleGenerateSkills}
                                        disabled={isGeneratingSkills}
                                        className="px-4 py-3 border border-indigo-200 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 flex items-center gap-2"
                                    >
                                        {isGeneratingSkills ? (
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Sparkles size={16} />
                                        )}
                                        Generate Suggestions
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data.skills.map((skill) => (
                                        <div
                                            key={skill.id}
                                            className="flex items-center justify-between p-4 bg-white border border-cozy-100 rounded-xl"
                                        >
                                            <span className="font-bold text-cozy-700">
                                                {skill.name}
                                            </span>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={skill.level}
                                                    onChange={(e) => {
                                                        const newSkills =
                                                            data.skills.map(
                                                                (s) =>
                                                                    s.id ===
                                                                    skill.id
                                                                        ? {
                                                                              ...s,
                                                                              level: parseInt(
                                                                                  e
                                                                                      .target
                                                                                      .value,
                                                                              ),
                                                                          }
                                                                        : s,
                                                            );
                                                    }}
                                                    className="w-24 accent-cozy-500"
                                                    disabled
                                                />
                                                <button
                                                    onClick={() =>
                                                        deleteSkill(skill.id)
                                                    }
                                                    className="text-red-400 hover:text-red-600"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </MotionDiv>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
