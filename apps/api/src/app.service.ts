import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  ping(): string {
    const now = new Date();
    this.logger.log(`Pong: ${now.toISOString()}`);
    return 'Pong';
  }
}
