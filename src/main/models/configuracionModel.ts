import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity('configuracion')
export class Configuracion extends BaseEntity {
    @PrimaryColumn({ default: 1 })  //ESTE CAMPO SE UTILIZA PARA GARANTIZAR QUE SOLO HAYA UNA CONFIGURACION, SIEMPRE CON ID 1
    id: number =1;

    @Column()
    restaurante_nombre: string;

    @Column()
    logo_url: string;

    @Column()
    descripcion: string;

    @Column()
    direccion: string;

    @Column()
    telefono: string;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
