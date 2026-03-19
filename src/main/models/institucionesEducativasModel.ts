import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Distrito } from "./distritosModel";

@Entity('institucioneseducativas')
export class InstitucionEducativa extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    codigoModular: string;

    @Column()
    nombreIE: string;

    @Column({
        type: 'enum',
        enum: ['INICIAL-JARDIN', 'PRIMARIA', 'SECUNDARIA', 'EBA-CEPTPRO'],
        default: 'PRIMARIA'
    })
    nivelModalidad: 'INICIAL-JARDIN' | 'PRIMARIA' | 'SECUNDARIA' | 'EBA-CEPTPRO';

    @Column({ nullable: true })
    distritoId: number;

    @ManyToOne(() => Distrito)
    @JoinColumn({ name: 'distritoId' })
    distrito: Distrito;

    @Column({ default: true })
    estado: boolean;

    @CreateDateColumn()
    createdat: Date;
    
    @UpdateDateColumn()
    updatedat: Date;
}
