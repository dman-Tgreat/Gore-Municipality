import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Ddg@36240667',
      database: 'gore_db',
      autoLoadEntities:true,
      synchronize:true,
    }),
  ],
})
export class AppModule {}
