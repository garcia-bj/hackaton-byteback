import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import PDFDocument = require('pdfkit');
import * as QRCode from 'qrcode';

@Injectable()
export class EvidenceService {
    constructor(private prisma: PrismaService) { }

    async storeEvidence(
        fileBuffer: Buffer,
        fileType: string,
        ipAddress: string,
        userAgent: string,
    ) {
        try {
            // Calcular SHA-256 Hash del archivo recibido directamente en memoria (WORM).
            const hashSum = crypto.createHash('sha256');
            hashSum.update(fileBuffer);
            const sha256Hash = hashSum.digest('hex');

            // TODO: Subir a S3 (Actualmente lo simulamos como archivo local o mock)
            const fileUrl = `/storage/mocks/${sha256Hash}.${fileType.split('/')[1] || 'webm'}`;

            // Crear un usuario ficticio si no hay AUTH implementada para que no rompa la constraint.
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

            // Guardar registro inmutable en PostgreSQL.
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
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new InternalServerErrorException(
                    'Este archivo ya ha sido certificado anteriormente. Prueba inalterable duplicada.',
                );
            }
            throw new InternalServerErrorException(
                'Error registrando la evidencia: ' + error.message,
            );
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

        // Seed initial demos if empty
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

    async verifyEvidence(hash: string) {
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

    async renameEvidence(hash: string, userId: string, newTitle: string) {
        const evidence = await this.prisma.evidence.findUnique({
            where: { sha256Hash: hash },
        });

        if (!evidence || evidence.userId !== userId) {
            throw new InternalServerErrorException('Evidencia no encontrada o sin permisos');
        }

        return this.prisma.evidence.update({
            where: { sha256Hash: hash },
            data: { title: newTitle },
        });
    }

    async generateCertificatePdf(hash: string): Promise<PDFKit.PDFDocument> {
        const evidence = await this.prisma.evidence.findUnique({
            where: { sha256Hash: hash },
            include: { user: true },
        });

        if (!evidence) {
            throw new InternalServerErrorException('Evidencia no encontrada para generar certificado');
        }

        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        // Estilo Formal Legal
        doc.font('Helvetica-Bold').fontSize(20).text('CERTIFICADO DE EVIDENCIA DIGITAL', { align: 'center' });
        doc.moveDown(2);

        doc.font('Helvetica').fontSize(12);
        doc.text('Por medio de la presente, el sistema ProtegeT certifica la inmutabilidad de la evidencia digital registrada con los siguientes parámetros técnicos y legales:');
        doc.moveDown(1.5);

        // Datos del Propietario
        doc.font('Helvetica-Bold').text('1. DATOS DEL TITULAR');
        doc.font('Helvetica').text(`  - Nombre Completo: ${evidence.user.fullName}`);
        doc.text(`  - Rol Registrado: ${evidence.user.role}`);
        doc.text(`  - Email: ${evidence.user.email}`);
        doc.moveDown(1);

        // Datos Técnicos Inmutables
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

        // Generar QR
        const verificationUrl = `http://localhost:3000/verify/${evidence.sha256Hash}`;
        const qrImage = await QRCode.toDataURL(verificationUrl, { errorCorrectionLevel: 'H' });

        doc.moveDown(2);
        // Draw QR Code image in the PDF
        doc.image(qrImage, doc.page.width / 2 - 75, doc.y, { width: 150 });

        // Empujamos el cursor hacia abajo manualmente para que no se superponga el QR con el texto
        doc.y += 160;

        doc.moveDown(2);
        doc.fontSize(10).text('ESTE DOCUMENTO ES UNA REPRESENTACIÓN IMPRESA CREADA POR PROTEGET.', { align: 'center' });
        doc.text('VALIDO PARA EFECTOS LEGALES Y PERICIALES EN BOLIVIA.', { align: 'center' });

        doc.end();
        return doc;
    }
}
