import { EvidenceService } from './evidence.service';
import type { Request, Response } from 'express';
export declare class EvidenceController {
    private readonly evidenceService;
    constructor(evidenceService: EvidenceService);
    uploadEvidence(file: Express.Multer.File, request: Request | any): Promise<{
        success: boolean;
        reportId: string;
        hash: string;
        timestampCert: Date;
        message: string;
    }>;
    listEvidences(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fileUrl: string;
        fileType: string;
        title: string | null;
        sha256Hash: string;
        ipAddress: string | null;
        userAgent: string | null;
        status: import(".prisma/client").$Enums.EvidenceStatus;
        timestampCert: Date;
        userId: string;
    }[]>;
    verifyHash(hash: string): Promise<{
        verified: boolean;
        message: string;
        integrity?: undefined;
        timestampCert?: undefined;
        fileUrl?: undefined;
        owner?: undefined;
        ipAddress?: undefined;
    } | {
        verified: boolean;
        integrity: string;
        timestampCert: Date;
        fileUrl: string;
        owner: string;
        ipAddress: string | null;
        message?: undefined;
    }>;
    renameEvidence(hash: string, title: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fileUrl: string;
        fileType: string;
        title: string | null;
        sha256Hash: string;
        ipAddress: string | null;
        userAgent: string | null;
        status: import(".prisma/client").$Enums.EvidenceStatus;
        timestampCert: Date;
        userId: string;
    }>;
    downloadCertificate(hash: string, res: Response): Promise<void>;
}
