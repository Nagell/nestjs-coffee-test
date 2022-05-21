import { DynamicModule, Module } from '@nestjs/common'
import { DataSourceOptions, DataSource } from 'typeorm'

@Module({})
export class DatabaseModule {
    static register(options: DataSourceOptions): DynamicModule {
        return {
            module: DatabaseModule,
            providers: [
                {
                    provide: 'CONNECTION',
                    useFactory: async () =>
                        await new DataSource(options),
                },
            ],
        }
    }
}
