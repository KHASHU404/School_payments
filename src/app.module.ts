// src/app.module.ts
import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    // ensure .env is loaded and ConfigService is available globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        if (!uri) {
          // make the error explicit and stop app boot
          const msg = 'MONGODB_URI is not defined. Create .env or set the env var.';
          Logger.error(msg);
          throw new Error(msg);
        }
        return {
          uri,
          // optional socket/connection options go here
        };
      },
      inject: [ConfigService],
    }),

    OrdersModule,
    AuthModule,
    PaymentsModule,
    TransactionsModule
    // ... other modules
  ],
})
export class AppModule {}
