import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from "typeorm";
import { RegistroCita } from "./registrosCitasModel";

@Entity('citas')
export class Cita extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @Column()
    descripcion: string;

    @OneToMany(() => RegistroCita, registro => registro.cita)
    registros: RegistroCita[];
}
