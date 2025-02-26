import { IEmailConfig } from '@aiofc/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class MailerService {
  private nodemailerTransport: Transporter;

  constructor(private readonly configService: ConfigService) {
    const emailConfig = this.configService.get<IEmailConfig>('email');
    this.nodemailerTransport = createTransport({
      host: emailConfig?.host,
      port: emailConfig?.port,
      auth: {
        user: emailConfig?.auth?.user,
        pass: emailConfig?.auth?.password,
      },
      debug: emailConfig?.debug,
      logger: emailConfig?.logger,
    });
  }

  sendMail(options: any) {
    return this.nodemailerTransport.sendMail(options);
  }
}
