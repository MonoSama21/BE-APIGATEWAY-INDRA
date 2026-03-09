import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cargo } from "./cargosModel";

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
