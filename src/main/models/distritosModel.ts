import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('distritos')
export class Distrito extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    distrito: string;

    @Column({ nullable: true })
    alias: string;

    @Column({ default: true })
    estado: boolean;

    @CreateDateColumn()
    createdat: Date;
    
    @UpdateDateColumn()
    updatedat: Date;
}
