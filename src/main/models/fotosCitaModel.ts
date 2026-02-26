import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, JoinColumn } from "typeorm";
import { RegistroCita } from "./registrosCitasModel";

@Entity('fotos_cita')
export class FotoCita extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => RegistroCita, registro => registro.fotos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'registroid' })
    registro: RegistroCita;

    @Column({ length: 255 })
    url: string;
}
