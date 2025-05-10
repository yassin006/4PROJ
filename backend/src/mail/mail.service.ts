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
    const resetUrl = `http://localhost:5173/RESET-password?token=${token}`;

    await this.transporter.sendMail({
      from: `"Trafine Support" <${this.configService.get('EMAIL_USER')}>`,
      to,
      subject: '🔐 Réinitialisation de mot de passe',
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>Réinitialisation de votre mot de passe</h2>
          <p>Bonjour,</p>
          <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
          <p>Cliquez sur le bouton ci-dessous pour continuer :</p>
          <p style="text-align: center; margin: 20px;">
            <a href="${resetUrl}" style="background-color: #3b82f6; padding: 10px 20px; color: white; text-decoration: none; border-radius: 5px;">
              Réinitialiser le mot de passe
            </a>
          </p>
          <p>Ce lien expire dans 10 minutes.</p>
          <p style="font-size: 0.9em; color: gray;">Si vous n'avez pas fait cette demande, vous pouvez ignorer cet email.</p>
        </div>
      `,
    });
  }
}
