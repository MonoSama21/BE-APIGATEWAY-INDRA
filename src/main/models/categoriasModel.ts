import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Plato } from "./platosModel";

@Entity('categorias') //NOMBRE DE LA TABLA EN LA BASE DE DATOS
export class Categoria extends BaseEntity {

    @PrimaryGeneratedColumn()  //UN NUMERO AUTOINCREMENTAL QUE SIRVE COMO ID
    id: number;

    @Column()
    nombre: String;

    @Column()
    descripcion: String;
    
    @Column()
    posicion: String;
    

    //PARA GUARDAR LA FECHA DE CREACION DE CADA REGISTRO
    @CreateDateColumn()
    createdAt: Date;
    
    //PARA GUARDAR LA FECHA DE ACTUALIZACION DE CADA REGISTRO
    @UpdateDateColumn()
    updatedAt: Date;

    //UNA CATEGORIA TIENE MUCHOS PLATOS
    @OneToMany(() => Plato, plato => plato.categoria)
    platos: Plato[];


}