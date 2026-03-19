import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cargo } from "./cargosModel";
import { Distrito } from "./distritosModel";
import { InstitucionEducativa } from "./institucionesEducativasModel";

@Entity('personal')
export class Personal extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 8 })
    dni: string;

    @Column()
    nombres: string;

    @Column()
    apellidos: string;

    @ManyToOne(() => Cargo)
    @JoinColumn({ name: 'cargoId' })
    cargo: Cargo;

    @Column()
    cargoId: number;

    @ManyToOne(() => Distrito)
    @JoinColumn({ name: 'distritoId' })
    distrito: Distrito;

    @Column({ nullable: true })
    distritoId: number;

    @Column({
        type: 'enum',
        enum: ['INICIAL-JARDIN', 'PRIMARIA', 'SECUNDARIA', 'EBA-CEPTPRO'],
        nullable: true
    })
    nivelModalidad: 'INICIAL-JARDIN' | 'PRIMARIA' | 'SECUNDARIA' | 'EBA-CEPTPRO' | null;

    @ManyToOne(() => InstitucionEducativa)
    @JoinColumn({ name: 'institucionEducativaId' })
    institucionEducativa: InstitucionEducativa;

    @Column({ nullable: true })
    institucionEducativaId: number;

    @Column({ nullable: true })
    codigoQR: string;

    @Column({ nullable: true })
    foto: string;

    @Column({ default: true })
    estado: boolean;

    @CreateDateColumn()
    createdat: Date;

    @UpdateDateColumn()
    updatedat: Date;
}
