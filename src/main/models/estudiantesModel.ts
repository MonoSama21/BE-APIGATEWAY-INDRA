import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity('estudiantes') //NOMBRE DE LA TABLA EN LA BASE DE DATOS
export class Estudiante extends BaseEntity {

    @PrimaryGeneratedColumn()  //UN NUMERO AUTOINCREMENTAL QUE SIRVE COMO ID
    id: number;

    @Column()
    dni: String;

    @Column()
    nombre: String;
    
    @Column()
    apellido: String;
    
    @Column()
    email: String;

    //PARA GUARDAR LA FECHA DE CREACION DE CADA REGISTRO
    @CreateDateColumn()
    createdAt: Date;
    
    //PARA GUARDAR LA FECHA DE ACTUALIZACION DE CADA REGISTRO
    @UpdateDateColumn()
    updatedAt: Date;



}