import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Personal } from "./personalModel";
import { Usuario } from "./usuariosModel";

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

    // ✅ AUDITORÍA: Quién registró esta asistencia
    // ENTRADA
    @Column({ nullable: true })
    usuarioIdEntrada: number;

    @Column({ nullable: true })
    usuarioNombreEntrada: string;

    // SALIDA
    @Column({ nullable: true })
    usuarioIdSalida: number;

    @Column({ nullable: true })
    usuarioNombreSalida: string;

    @CreateDateColumn()
    createdat: Date;
}
