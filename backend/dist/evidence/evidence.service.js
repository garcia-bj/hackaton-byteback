"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvidenceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto = __importStar(require("crypto"));
const PDFDocument = require("pdfkit");
const QRCode = __importStar(require("qrcode"));
let EvidenceService = class EvidenceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async storeEvidence(fileBuffer, fileType, ipAddress, userAgent) {
        try {
            const hashSum = crypto.createHash('sha256');
            hashSum.update(fileBuffer);
            const sha256Hash = hashSum.digest('hex');
            const fileUrl = `/storage/mocks/${sha256Hash}.${fileType.split('/')[1] || 'webm'}`;
            let mockedUser = await this.prisma.user.findFirst();
            if (!mockedUser) {
                mockedUser = await this.prisma.user.create({
                    data: {
                        email: 'victim_mock_1@safeguard.test',
                        passwordHash: 'hashed_password_mock',
                        fullName: 'Usuario Victima Uno',
                    },
                });
            }
            const evidence = await this.prisma.evidence.create({
                data: {
                    sha256Hash,
                    fileUrl,
                    fileType,
                    ipAddress,
                    userAgent,
                    userId: mockedUser.id,
                    status: 'SEALED',
                },
            });
            return {
                success: true,
                reportId: evidence.id,
                hash: sha256Hash,
                timestampCert: evidence.timestampCert,
                message: 'Evidencia sellada criptográficamente',
            };
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.InternalServerErrorException('Este archivo ya ha sido certificado anteriormente. Prueba inalterable duplicada.');
            }
            throw new common_1.InternalServerErrorException('Error registrando la evidencia: ' + error.message);
        }
    }
    async getUserEvidences() {
        let mockedUser = await this.prisma.user.findFirst();
        if (!mockedUser) {
            mockedUser = await this.prisma.user.create({
                data: {
                    email: 'victim_mock_1@safeguard.test',
                    passwordHash: 'hashed_password_mock',
                    fullName: 'Usuario Victima Uno',
                },
            });
        }
        const count = await this.prisma.evidence.count({ where: { userId: mockedUser.id } });
        if (count === 0) {
            await this.prisma.evidence.createMany({
                data: [
                    {
                        userId: mockedUser.id,
                        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                        fileType: 'video/webm',
                        fileUrl: '/storage/mocks/dummy1.webm',
                        status: 'SEALED',
                        timestampCert: new Date('2026-03-08T14:30:00Z'),
                    },
                    {
                        userId: mockedUser.id,
                        sha256Hash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
                        fileType: 'video/webm',
                        fileUrl: '/storage/mocks/dummy2.webm',
                        status: 'VERIFIED',
                        timestampCert: new Date('2026-03-07T10:15:22Z'),
                    }
                ]
            });
        }
        return this.prisma.evidence.findMany({
            where: { userId: mockedUser.id },
            orderBy: { timestampCert: 'desc' }
        });
    }
    async verifyEvidence(hash) {
        const evidence = await this.prisma.evidence.findUnique({
            where: { sha256Hash: hash },
            include: { user: { select: { fullName: true } } },
        });
        if (!evidence) {
            return { verified: false, message: 'Evidencia no encontrada en el registro.' };
        }
        return {
            verified: true,
            integrity: 'INTACT',
            timestampCert: evidence.timestampCert,
            fileUrl: evidence.fileUrl,
            owner: evidence.user.fullName,
            ipAddress: evidence.ipAddress,
        };
    }
    async renameEvidence(hash, userId, newTitle) {
        const evidence = await this.prisma.evidence.findUnique({
            where: { sha256Hash: hash },
        });
        if (!evidence || evidence.userId !== userId) {
            throw new common_1.InternalServerErrorException('Evidencia no encontrada o sin permisos');
        }
        return this.prisma.evidence.update({
            where: { sha256Hash: hash },
            data: { title: newTitle },
        });
    }
    async generateCertificatePdf(hash) {
        const evidence = await this.prisma.evidence.findUnique({
            where: { sha256Hash: hash },
            include: { user: true },
        });
        if (!evidence) {
            throw new common_1.InternalServerErrorException('Evidencia no encontrada para generar certificado');
        }
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        doc.font('Helvetica-Bold').fontSize(20).text('CERTIFICADO DE EVIDENCIA DIGITAL', { align: 'center' });
        doc.moveDown(2);
        doc.font('Helvetica').fontSize(12);
        doc.text('Por medio de la presente, el sistema ProtegeT certifica la inmutabilidad de la evidencia digital registrada con los siguientes parámetros técnicos y legales:');
        doc.moveDown(1.5);
        doc.font('Helvetica-Bold').text('1. DATOS DEL TITULAR');
        doc.font('Helvetica').text(`  - Nombre Completo: ${evidence.user.fullName}`);
        doc.text(`  - Rol Registrado: ${evidence.user.role}`);
        doc.text(`  - Email: ${evidence.user.email}`);
        doc.moveDown(1);
        doc.font('Helvetica-Bold').text('2. METADATOS TÉCNICOS Y HUELLA CRIPTOGRÁFICA');
        doc.font('Helvetica');
        doc.text(`  - Hash SHA-256 (Identificador Único):`);
        doc.font('Courier').fontSize(10).text(`    ${evidence.sha256Hash}`);
        doc.font('Helvetica').fontSize(12);
        doc.text(`  - Dirección IP de Origen: ${evidence.ipAddress || 'No Registrada'}`);
        doc.text(`  - User Agent (Navegador/Dispositivo):`);
        doc.font('Courier').fontSize(10).text(`    ${evidence.userAgent || 'No Registrado'}`);
        doc.font('Helvetica').fontSize(12);
        doc.text(`  - Fecha y Hora del Sellado Fijo (UTC): ${evidence.timestampCert.toISOString()}`);
        doc.moveDown(2);
        doc.font('Helvetica-Bold').text('3. VERIFICACIÓN LEGAL');
        doc.font('Helvetica').text('Cualquier alteración en el archivo original invalidará el identificador criptográfico descrito en este documento. Escanee el siguiente Código QR gubernamental para verificar la integridad actual de esta evidencia en la plataforma ProtegeT oficial.');
        const verificationUrl = `http://localhost:3000/verify/${evidence.sha256Hash}`;
        const qrImage = await QRCode.toDataURL(verificationUrl, { errorCorrectionLevel: 'H' });
        doc.moveDown(2);
        doc.image(qrImage, doc.page.width / 2 - 75, doc.y, { width: 150 });
        doc.y += 160;
        doc.moveDown(2);
        doc.fontSize(10).text('ESTE DOCUMENTO ES UNA REPRESENTACIÓN IMPRESA CREADA POR PROTEGET.', { align: 'center' });
        doc.text('VALIDO PARA EFECTOS LEGALES Y PERICIALES EN BOLIVIA.', { align: 'center' });
        doc.end();
        return doc;
    }
};
exports.EvidenceService = EvidenceService;
exports.EvidenceService = EvidenceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EvidenceService);
//# sourceMappingURL=evidence.service.js.map