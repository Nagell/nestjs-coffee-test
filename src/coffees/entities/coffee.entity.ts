import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity() // automatically creates table in database ('coffee' in this case)
export class Coffee {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    brand: string

    @Column('json', { nullable: true })
    flavours: string[]
}
