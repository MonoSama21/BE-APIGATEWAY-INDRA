import { BaseEntity, Column, CreateDateColumn, Entity, Exclusion, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('usuarios')
export class Usuario extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nombre: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    rol: string;

    @Column({
        type: 'boolean',
        width: 1,
        transformer: {
            to: (value: boolean | number) => value ? 1 : 0,
            from: (value: number) => value === 1
        }
    })
    activo: boolean;

    @CreateDateColumn()
    createdat: Date;

    @UpdateDateColumn()
    updatedat: Date;

}
