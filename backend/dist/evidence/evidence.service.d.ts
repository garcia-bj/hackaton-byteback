import { PrismaService } from '../prisma/prisma.service';
export declare class EvidenceService {
    private prisma;
    constructor(prisma: PrismaService);
    storeEvidence(fileBuffer: Buffer, fileType: string, ipAddress: string, userAgent: string): Promise<{
        success: boolean;
        reportId: string;
        hash: string;
        timestampCert: Date;
        message: string;
    }>;
    getUserEvidences(): Promise<{
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
    verifyEvidence(hash: string): Promise<{
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
    renameEvidence(hash: string, userId: string, newTitle: string): Promise<{
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
    generateCertificatePdf(hash: string): Promise<PDFKit.PDFDocument>;
}
