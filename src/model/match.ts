import {BelongsTo, Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript"
import UserModel from "./user";
import TournamentModel from "./tournament";

@Table({tableName: "match", underscored: true, timestamps: false})
export default class MatchModel extends Model {

    @PrimaryKey
    @Column({primaryKey: true, allowNull: false, type: DataType.UUID, defaultValue: DataType.UUIDV4})
    id: string;

    @Column({allowNull: false, type: DataType.DATEONLY})
    date: Date;

    @Column({allowNull: true, type: DataType.DATE})
    startAt?: Date;

    @Column({allowNull: true, type: DataType.DATE})
    endAt?: Date;

    @Column({allowNull: true, type: DataType.STRING})
    result?: "USER1_WINS" | "USER2_WINS" | "TIE";

    @BelongsTo(() => UserModel, {foreignKey: {name: "user1Id", allowNull: false}})
    user1: UserModel;

    @BelongsTo(() => UserModel, {foreignKey: {name: "user2Id", allowNull: false}})
    user2: UserModel;

    @BelongsTo(() => TournamentModel, {foreignKey: {name: "tournamentId", allowNull: false}})
    tournament: TournamentModel;
}