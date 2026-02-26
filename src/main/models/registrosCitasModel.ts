import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany, CreateDateColumn, Unique, BaseEntity, JoinColumn } from "typeorm";
import { Novio } from "./noviosModel";
import { Cita } from "./citasModel";
import { FotoCita } from "./fotosCitaModel";

@Entity('registros_citas')
@Unique(['novio', 'cita'])
export class RegistroCita extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Novio, novio => novio.registrosCitas)
    @JoinColumn({ name: 'novioid' })
    novio: Novio;

    @ManyToOne(() => Cita, cita => cita.registros)
    @JoinColumn({ name: 'citaid' })
    cita: Cita;

    @Column({ type: 'text', nullable: true })
    comentario: string;

    @CreateDateColumn()
    fecharealizada: Date;

    @OneToMany(() => FotoCita, foto => foto.registro)
    fotos: FotoCita[];
}
