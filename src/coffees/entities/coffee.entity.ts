import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm"
import { Flavor } from "./flavor.entity"

@Entity() // automatically creates table in database ('coffee' in this case)
export class Coffee {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    brand: string

    @JoinTable()
    @ManyToMany(
        type => Flavor,
        flavor => flavor.coffees,
        {
            cascade: true,
        }
    )
    flavors: Flavor[]
}
