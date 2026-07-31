import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
}

@Injectable()
export class RazorpayService {
  private readonly client: Razorpay;
  private readonly keySecret: string;
  readonly keyId: string;

  constructor(private readonly config: ConfigService) {
    this.keyId = this.config.getOrThrow<string>('RAZORPAY_KEY_ID');
    this.keySecret = this.config.getOrThrow<string>('RAZORPAY_KEY_SECRET');
    this.client = new Razorpay({ key_id: this.keyId, key_secret: this.keySecret });
  }

  async createOrder(amount: number, currency: string, receipt: string): Promise<RazorpayOrder> {
    return this.client.orders.create({
      amount: Math.round(amount * 100),
      currency: currency.toUpperCase(),
      receipt,
    }) as unknown as Promise<RazorpayOrder>;
  }

  verifySignature(razorpayOrderId: string, razorpayPaymentId: string, signature: string): boolean {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expected = crypto.createHmac('sha256', this.keySecret).update(body).digest('hex');
    return expected === signature;
  }
}
