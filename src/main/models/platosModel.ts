import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Categoria } from "./categoriasModel";

@Entity('Platos') //NOMBRE DE LA TABLA EN LA BASE DE DATOS
export class Plato extends BaseEntity {

    @PrimaryGeneratedColumn()  //UN NUMERO AUTOINCREMENTAL QUE SIRVE COMO ID
    id: number;

    @Column()
    categoriaId: number;

    @Column()
    name: String;

    @Column()
    descripcion: String;
    
    @Column()
    precio: String;
    
    @Column()
    imagen_url: String;

    @Column()
    posicion: String;

    //PARA GUARDAR LA FECHA DE CREACION DE CADA REGISTRO
    @CreateDateColumn()
    createdAt: Date;
    
    //PARA GUARDAR LA FECHA DE ACTUALIZACION DE CADA REGISTRO
    @UpdateDateColumn()
    updatedAt: Date;


    // UN PLATO PERTENECE A UNA CATEGORIA
    @ManyToOne(() => Categoria, categoria => categoria.platos)
    categoria: Categoria;

}