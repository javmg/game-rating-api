import {Column, DataType, HasMany, Model, PrimaryKey, Table} from "sequelize-typescript"
import MatchModel from "./match";

@Table({tableName: "tournament", underscored: true, timestamps: false})
export default class TournamentModel extends Model {

    @PrimaryKey
    @Column({primaryKey: true, allowNull: false, type: DataType.UUID, defaultValue: DataType.UUIDV4})
    id: string;

    @Column({allowNull: false, type: DataType.STRING})
    name: string;

    @Column({allowNull: false, type: DataType.DATE})
    startAt: Date;

    @Column({allowNull: false, type: DataType.DATE})
    endAt: Date;

    @Column({allowNull: false, type: DataType.BOOLEAN})
    processed: boolean;

    @HasMany(() => MatchModel, {foreignKey: {name: "tournamentId", allowNull: false}})
    matches: MatchModel[]
}