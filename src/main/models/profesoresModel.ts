import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Curso } from "./cursoModel";

@Entity('profesores')
export class Profesor extends BaseEntity {

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

    @Column()
    profesion: String;

    @Column()
    telefono: String;

    //PARA GUARDAR LA FECHA DE CREACION DE CADA REGISTRO
    @CreateDateColumn()
    createdAt: Date;

    //PARA GUARDAR LA FECHA DE ACTUALIZACION DE CADA REGISTRO
    @UpdateDateColumn()
    updatedAt: Date;

    //UN PROFESOR TIENE MUCHOS CURSOS
    @OneToMany(() => Curso, (curso) => curso.profesor )
    cursos: Curso[];

}