export interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    tags: string[];
    link?: string;
}

export interface Skill {
    id: string;
    name: string;
    level: number; // 0-100
    icon?: string;
}

export interface Profile {
    name: string;
    title: string;
    bio: string;
    email: string;
    socials: {
        github?: string;
        twitter?: string;
        linkedin?: string;
    };
}

export interface PortfolioData {
    profile: Profile;
    projects: Project[];
    skills: Skill[];
}

export interface PortfolioContextType {
    data: PortfolioData;
    updateProfile: (profile: Profile) => void;
    addProject: (project: Project) => void;
    updateProject: (project: Project) => void;
    deleteProject: (id: string) => void;
    addSkill: (skill: Skill) => void;
    updateSkill: (skill: Skill) => void;
    deleteSkill: (id: string) => void;
    resetData: () => void;
}
