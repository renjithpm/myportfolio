import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST'),
      port: this.config.get<number>('SMTP_PORT'),
      secure: this.config.get<boolean>('SMTP_SECURE'),
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
    });
  }

  async create(dto: CreateContactDto): Promise<void> {
    await this.prisma.contactSubmission.create({
      data: {
        name: dto.name,
        email: dto.email,
        message: dto.message,
      },
    });

    await this.sendNotification(dto).catch((err: unknown) => {
      // Email failure should not break the API response; log and continue.
      this.logger.warn('Email notification failed', err);
    });
  }

  private async sendNotification(dto: CreateContactDto): Promise<void> {
    const smtpUser = this.config.get<string>('SMTP_USER');
    if (!smtpUser) return;

    await this.transporter.sendMail({
      from: this.config.get<string>('SMTP_FROM'),
      to: this.config.get<string>('SMTP_TO'),
      replyTo: dto.email,
      subject: `Portfolio contact from ${dto.name}`,
      text: `Name: ${dto.name}\nEmail: ${dto.email}\n\n${dto.message}`,
      html: `
        <p><strong>Name:</strong> ${dto.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${dto.email}">${dto.email}</a></p>
        <p><strong>Message:</strong></p>
        <p>${dto.message.replace(/\n/g, '<br>')}</p>
      `,
    });
  }
}
