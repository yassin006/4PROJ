import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('EMAIL_HOST'),
      port: Number(configService.get('EMAIL_PORT')),
      secure: false,
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASS'),
      },
    });
  }

  async sendResetPasswordEmail(to: string, token: string) {
    const resetUrl = `http://localhost:3000/auth/reset-password?token=${token}`;
    await this.transporter.sendMail({
      from: `"Trafine Support" <${this.configService.get('EMAIL_USER')}>`,
      to,
      subject: '🔐 Réinitialisation de mot de passe',
      html: `
        <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
        <p>Cliquez sur ce lien pour continuer :</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p><small>Ce lien expire dans 10 minutes.</small></p>
      `,
    });
  }
}
