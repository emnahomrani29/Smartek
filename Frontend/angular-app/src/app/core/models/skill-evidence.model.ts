export interface SkillEvidence {
    evidenceId?: number;       
    title: string;
    fileUrl?: string;
    description?: string;
    uploadDate?: Date;       
    user?: {
        userId: number;
        email?: string;
        fullName?: string;
    };
}
