import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('Novios') //NOMBRE DE LA TABLA EN LA BASE DE DATOS
export class Novio extends BaseEntity {

    @PrimaryGeneratedColumn()  //UN NUMERO AUTOINCREMENTAL QUE SIRVE COMO ID
    id: number;

    @Column()
    nombre: String;

    @Column()
    email: String;

    @Column()
    telefono: String;

    @Column()
    password: String;

    @CreateDateColumn()
    createdat: Date;

    
    @CreateDateColumn()
    updatedat: Date;

}