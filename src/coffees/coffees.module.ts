import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CoffeesController } from './coffees.controller'
import { CoffeesService } from './coffees.service'
import { Coffee } from './entities/coffee.entity'
import { Flavor } from './entities/flavor.entity'
import { Event } from '../events/entities/event.entity'
import { COFFEE_BRANDS } from './coffees.constants'
import { DataSourceOptions } from 'typeorm'
import { ConfigModule } from '@nestjs/config'
import coffeesConfig from './config/coffees.config'

class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Module({
    imports: [
        TypeOrmModule.forFeature([Coffee, Flavor, Event]),
        ConfigModule.forFeature(coffeesConfig)
    ],
    controllers: [CoffeesController],
    providers: [
        CoffeesService,
        // Asynchronous "useFactory" (async provider example)
        {
            provide: COFFEE_BRANDS,
            // Note "async" here, and Promise/Async event inside the Factory function 
            // Could be a database connection / API call / etc
            // In our case we're just "mocking" this type of event with a Promise
            useFactory: async (connection: DataSourceOptions): Promise<string[]> => {
                // const coffeeBrands = await connection.query('SELECT * ...');
                const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe'])
                console.log('[!] Async factory') 
                return coffeeBrands
            },
        },
        {
            provide: ConfigService,
            useClass:
                process.env.NODE_ENV === 'development'
                    ? DevelopmentConfigService
                    : ProductionConfigService,
        },
    ],
    exports: [CoffeesService],
})
export class CoffeesModule {}
