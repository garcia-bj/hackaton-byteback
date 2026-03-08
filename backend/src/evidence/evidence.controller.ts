import {
    Controller,
    Post,
    Get,
    Param,
    UseInterceptors,
    UploadedFile,
    Req,
    Res,
    BadRequestException,
    Put,
    Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EvidenceService } from './evidence.service';
import type { Request, Response } from 'express';

@Controller('api/evidence')
export class EvidenceController {
    constructor(private readonly evidenceService: EvidenceService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadEvidence(
        @UploadedFile() file: Express.Multer.File,
        @Req() request: Request | any,
    ) {
        if (!file) {
            throw new BadRequestException('El archivo de evidencia es requerido');
        }

        // Recolectar metadatos técnicos del request
        const ipAddress =
            (request.headers['x-forwarded-for'] as string) ||
            request.socket.remoteAddress ||
            'unknown-ip';

        const userAgent = request.headers['user-agent'] || 'unknown-browser';

        return this.evidenceService.storeEvidence(
            file.buffer,
            file.mimetype,
            ipAddress,
            userAgent,
        );
    }

    @Get('list')
    async listEvidences() {
        return this.evidenceService.getUserEvidences();
    }

    @Get('verify/:hash')
    async verifyHash(@Param('hash') hash: string) {
        return this.evidenceService.verifyEvidence(hash);
    }

    @Put('rename/:hash')
    async renameEvidence(
        @Param('hash') hash: string,
        @Body('title') title: string,
    ) {
        if (!title || title.trim() === '') {
            throw new BadRequestException('El nuevo título no puede estar vacío');
        }

        const user = await this.evidenceService['prisma'].user.findFirst();
        if (!user) {
            throw new BadRequestException('No user found');
        }

        return this.evidenceService.renameEvidence(hash, user.id, title);
    }

    @Get('pdf/:hash')
    async downloadCertificate(@Param('hash') hash: string, @Res() res: Response) {
        const pdfDoc = await this.evidenceService.generateCertificatePdf(hash);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="proteget-${hash.substring(0, 8)}.pdf"`,
        });

        pdfDoc.pipe(res);
    }
}
