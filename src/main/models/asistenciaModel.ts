import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Personal } from "./personalModel";

@Entity('asistencia')
export class Asistencia extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Personal)
    @JoinColumn({ name: 'personalId' })
    personal: Personal;

    @Column()
    personalId: number;

    @Column({ type: 'date' })
    fecha: string;

    @Column({ type: 'time', nullable: true })
    horaEntrada: string;

    @Column({ type: 'time', nullable: true })
    horaSalida: string;

    @Column({ nullable: true, length: 5 })
    horasTrabajadas: string; // Formato HH:MM

    @Column({ default: 'EN_CURSO' }) // EN_CURSO, COMPLETO
    estado: string;

    @CreateDateColumn()
    createdat: Date;
}
