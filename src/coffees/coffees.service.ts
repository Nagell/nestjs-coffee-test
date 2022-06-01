import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto'
import { Connection, Repository } from 'typeorm'
import { CreateCoffeeDto } from './dto/create-coffee.dto'
import { UpdateCoffeeDto } from './dto/update-coffee.dto'
import { Coffee } from './entities/coffee.entity'
import { Flavor } from './entities/flavor.entity'
import { Event } from '../events/entities/event.entity'
import { COFFEE_BRANDS } from './coffees.constants'
import { ConfigService, ConfigType } from '@nestjs/config'
import coffeesConfig from './config/coffees.config'

@Injectable()
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,

        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,

        private readonly connection: Connection,

        @Inject(COFFEE_BRANDS)
        private readonly coffeeBrands: string[],

        private readonly configService: ConfigService,

        @Inject(coffeesConfig.KEY)
        private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,
    ) {
        console.log(coffeeBrands)
        const databaseHost = this.configService.get<string>(
            'database.host',
            'localhost' // fallback value
        )
        console.log('Accessing env variables from main ConfigService - DB_HOST:', databaseHost)
        const coffeesConfigTest = this.configService.get<string>(
            'coffees.foo'
        )
        console.log('Accessing env variables from partial ConfigService - coffees:', coffeesConfigTest)
        
        const typedCoffeesConfig = this.coffeesConfiguration.foo
        console.log('Accessing process.env variables from partial config - coffees (typed; better):', typedCoffeesConfig)
    }

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, offset } = paginationQuery
        return this.coffeeRepository.find({
            order: { id: 'ASC' },
            relations: ['flavors'],
            skip: offset,
            take: limit,
        })
    }

    async findOne(id: string) {
        const coffee = await this.coffeeRepository.findOne({
            where: { id: +id },
            relations: ['flavors'],
        })
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`)
        }
        return coffee
    }

    async create(createCoffeeDto: CreateCoffeeDto) {
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map((name) =>
                this.preloadFlavorByName(name),
            ),
        )

        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors,
        })
        return this.coffeeRepository.save(coffee)
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
        const flavors
            = updateCoffeeDto.flavors
            && (await Promise.all(
                updateCoffeeDto.flavors.map((name) =>
                    this.preloadFlavorByName(name),
                ),
            ))

        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors,
        })
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`)
        }
        return this.coffeeRepository.save(coffee)
    }

    async remove(id: string) {
        const coffee = await this.coffeeRepository.findOneBy({ id: +id })
        if (coffee) {
            return this.coffeeRepository.remove(coffee)
        }
        return new NotFoundException(`Coffee #${id} not found`)
    }

    async recommendCoffee(coffee: Coffee) {
        const queryRunner = this.connection.createQueryRunner()

        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            coffee.recommendations++

            const recommendEvent = new Event()
            recommendEvent.name = 'recommend_coffee'
            recommendEvent.type = 'coffee'
            recommendEvent.payload = { coffeeId: coffee.id }

            await queryRunner.manager.save(coffee)
            await queryRunner.manager.save(recommendEvent)

            await queryRunner.commitTransaction()
        } catch (error) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    private async preloadFlavorByName(name: string): Promise<Flavor> {
        const existingFlavor = await this.flavorRepository.findOne({
            where: { name },
        })
        if (existingFlavor) {
            return existingFlavor
        }
        return this.flavorRepository.create({ name })
    }
}
