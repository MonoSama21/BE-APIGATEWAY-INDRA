import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany, CreateDateColumn, Unique, BaseEntity } from "typeorm";
import { Novio } from "./noviosModel";
import { Cita } from "./citasModel";
import { FotoCita } from "./fotosCitaModel";

@Entity('registros_citas')
@Unique(['novio', 'cita'])
export class RegistroCita extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Novio, novio => novio.registrosCitas)
    novio: Novio;

    @ManyToOne(() => Cita, cita => cita.registros)
    cita: Cita;

    @Column({ type: 'text', nullable: true })
    comentario: string;

    @CreateDateColumn()
    fechaRealizada: Date;

    @OneToMany(() => FotoCita, foto => foto.registro)
    fotos: FotoCita[];
}
