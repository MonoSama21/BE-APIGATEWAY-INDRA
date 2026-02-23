import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RegistroCita } from "./registrosCitasModel";

@Entity('Novios') //NOMBRE DE LA TABLA EN LA BASE DE DATOS
export class Novio extends BaseEntity {

    @PrimaryGeneratedColumn()  //UN NUMERO AUTOINCREMENTAL QUE SIRVE COMO ID
    id: number;

    @Column()
    nombre: string;

    @Column()
    email: string;

    @Column()
    telefono: string;

    @Column()
    password: string;

    @CreateDateColumn()
    createdat: Date;
    
    @CreateDateColumn()
    updatedat: Date;

    @OneToMany(() => RegistroCita, registro => registro.novio)
    registrosCitas: RegistroCita[];
    
}