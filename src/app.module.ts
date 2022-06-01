import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoffeesModule } from './coffees/coffees.module'
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module'
import { DatabaseModule } from './database/database.module'
import { ConfigModule } from '@nestjs/config'
// import * as Joi from '@hapi/joi'
import appConfig from './config/app.config'

@Module({
    imports: [
        ConfigModule.forRoot({
            // validationSchema: Joi.object({
            //     DB_HOST: Joi.string().required(),
            //     DB_PORT: Joi.number().default(5432),
            // }),
            load: [appConfig]
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            synchronize: true, // TODO: disable it for production
        }),
        CoffeesModule,
        CoffeeRatingModule,
        DatabaseModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
