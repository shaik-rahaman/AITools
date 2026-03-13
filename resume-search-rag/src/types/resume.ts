// src/types/resume.ts

export interface Resume {
    _id: string;
    text: string;
    embedding: number[];
    name: string;
    email: string;
    phone: string | null;
    location: string;
    company: string;
    role: string;
    education: string;
    total_Experience: number;
    relevant_Experience: number;
    skills: string[];
}