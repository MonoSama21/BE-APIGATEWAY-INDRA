import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('usuarios')
export class Usuario extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    correo: string;

    @Column()
    contraseña: string;

    @Column()
    rol: string;

    @Column({
        type: 'tinyint',
        width: 1,
        transformer: {
            to: (value: boolean | number) => value ? 1 : 0,
            from: (value: number) => value === 1
        }
    })
    activo: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
