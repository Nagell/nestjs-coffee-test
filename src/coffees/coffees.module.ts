import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CoffeesController } from './coffees.controller'
import { CoffeesService } from './coffees.service'
import { Coffee } from './entities/coffee.entity'
import { Flavor } from './entities/flavor.entity'
import { Event } from '../events/entities/event.entity'
import { COFFEE_BRANDS } from './coffees.constants'

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
    controllers: [CoffeesController],
    providers: [
        CoffeesService,
        {
            provide: COFFEE_BRANDS,
            useValue: ['buddy brew', 'nescafe'],
        },
    ],
    exports: [CoffeesService],
})
export class CoffeesModule {}
