"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvidenceController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const evidence_service_1 = require("./evidence.service");
let EvidenceController = class EvidenceController {
    evidenceService;
    constructor(evidenceService) {
        this.evidenceService = evidenceService;
    }
    async uploadEvidence(file, request) {
        if (!file) {
            throw new common_1.BadRequestException('El archivo de evidencia es requerido');
        }
        const ipAddress = request.headers['x-forwarded-for'] ||
            request.socket.remoteAddress ||
            'unknown-ip';
        const userAgent = request.headers['user-agent'] || 'unknown-browser';
        return this.evidenceService.storeEvidence(file.buffer, file.mimetype, ipAddress, userAgent);
    }
    async listEvidences() {
        return this.evidenceService.getUserEvidences();
    }
    async verifyHash(hash) {
        return this.evidenceService.verifyEvidence(hash);
    }
    async renameEvidence(hash, title) {
        if (!title || title.trim() === '') {
            throw new common_1.BadRequestException('El nuevo título no puede estar vacío');
        }
        const user = await this.evidenceService['prisma'].user.findFirst();
        if (!user) {
            throw new common_1.BadRequestException('No user found');
        }
        return this.evidenceService.renameEvidence(hash, user.id, title);
    }
    async downloadCertificate(hash, res) {
        const pdfDoc = await this.evidenceService.generateCertificatePdf(hash);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="proteget-${hash.substring(0, 8)}.pdf"`,
        });
        pdfDoc.pipe(res);
    }
};
exports.EvidenceController = EvidenceController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvidenceController.prototype, "uploadEvidence", null);
__decorate([
    (0, common_1.Get)('list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EvidenceController.prototype, "listEvidences", null);
__decorate([
    (0, common_1.Get)('verify/:hash'),
    __param(0, (0, common_1.Param)('hash')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EvidenceController.prototype, "verifyHash", null);
__decorate([
    (0, common_1.Put)('rename/:hash'),
    __param(0, (0, common_1.Param)('hash')),
    __param(1, (0, common_1.Body)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EvidenceController.prototype, "renameEvidence", null);
__decorate([
    (0, common_1.Get)('pdf/:hash'),
    __param(0, (0, common_1.Param)('hash')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EvidenceController.prototype, "downloadCertificate", null);
exports.EvidenceController = EvidenceController = __decorate([
    (0, common_1.Controller)('api/evidence'),
    __metadata("design:paramtypes", [evidence_service_1.EvidenceService])
], EvidenceController);
//# sourceMappingURL=evidence.controller.js.map