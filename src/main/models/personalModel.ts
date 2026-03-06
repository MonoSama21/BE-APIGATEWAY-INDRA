import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @Column()
    cargo: string;

    @Column({ nullable: true })
    codigoQR: string;

    @Column({ default: true })
    estado: boolean;

    @CreateDateColumn()
    createdat: Date;

    @UpdateDateColumn()
    updatedat: Date;
}
