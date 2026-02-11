import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Profesor } from "./profesoresModel";
import { Estudiante } from "./estudiantesModel";

@Entity('cursos') //NOMBRE DE LA TABLA EN LA BASE DE DATOS
export class Curso extends BaseEntity {

    @PrimaryGeneratedColumn()  //UN NUMERO AUTOINCREMENTAL QUE SIRVE COMO ID
    id: number;

    @Column()
    nombre: String;

    @Column('text') //TIPO EXACTO EN EL CAMPO
    descripcion: String;

    //PARA GUARDAR LA FECHA DE CREACION DE CADA REGISTRO
    @CreateDateColumn()
    createdAt: Date;
    
    //PARA GUARDAR LA FECHA DE ACTUALIZACION DE CADA REGISTRO
    @UpdateDateColumn()
    updatedAt: Date;

    //UN CURSO PERTENECE A UN PROFESOR
    @ManyToOne(() => Profesor, (profesor) => profesor.cursos)
    @JoinColumn({ name: 'profesor_id' }) //NOMBRE DE LA COLUMNA EN LA BASE DE DATOS
    profesor: Profesor

    @ManyToMany(() => Estudiante)
    @JoinTable({ 
        name: 'cursos_estudiantes', //NOMBRE DE LA TABLA INTERMEDIA
        joinColumn: { name: 'curso_id'}, //TABLA ORIGEN -NOMBRE DE LA COLUMNA EN LA BASE DE DATOS
        inverseJoinColumn: { name: 'estudiante_id' } //TABLA DESTINO -NOMBRE DE LA COLUMNA EN LA BASE DE DATOS
    }) //NOMBRE DE LA COLUMNA EN LA BASE DE DATOS
    estudiantes: Estudiante[];


}