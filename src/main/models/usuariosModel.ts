import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('usuarios') //NOMBRE DE LA TABLA EN LA BASE DE DATOS
export class Usuario extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({ unique: true })
    email: string;

    @Column({ default: 'usuario' })
    rol: string;

    @Column()
    telefono: string;

    @Column()
    password: string;

    @Column({ default: true })
    estado: boolean;

    @CreateDateColumn()
    createdat: Date;

    @UpdateDateColumn()
    updatedat: Date;

}