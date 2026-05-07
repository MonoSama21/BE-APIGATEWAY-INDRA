import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('registros')
export class Registro extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombreCompleto: string;

    @Column()
    dni: string;

    @Column()
    cargo: string;

    @Column('int')
    missionId: number;

    @Column()
    missionName: string;

    @Column('int')
    score: number;

    @Column('int')
    total: number;

    @Column('int')
    percentage: number;

    @Column({ default: false })
    approved: boolean;

    @Column({ nullable: true })
    pokeball: string;

    @CreateDateColumn({ type: 'timestamp' })
    completedAt: Date;
}
