import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
	  constructor(
    	private readonly prismaService: PrismaService,
	  ) {}
}
