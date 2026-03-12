import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('cargos')
export class Cargo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    cargo: string;

    @Column()
    descripcion: string;

    @Column({ default: true })
    estado: boolean;

    @CreateDateColumn()
    createdat: Date;
    
    @UpdateDateColumn()
    updatedat: Date;

}