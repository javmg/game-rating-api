import {BelongsTo, Column, DataType, Model, PrimaryKey} from "sequelize-typescript"
import TournamentModel from "./../tournament";
import UserModel from "./../user";

export default abstract class RatingAbstractModel extends Model {

    @PrimaryKey
    @Column({primaryKey: true, allowNull: false, type: DataType.UUID, defaultValue: DataType.UUIDV4})
    id: string;

    @Column({allowNull: false, type: DataType.DECIMAL})
    value: number;

    @Column({unique: "uk_rating_abstract__ut", type: DataType.UUID})
    userId: string;

    @Column({unique: "uk_rating_abstract__ut", type: DataType.UUID})
    tournamentId: string;

    @BelongsTo(() => UserModel, {foreignKey: {name: "userId", allowNull: false}})
    user: UserModel;

    @BelongsTo(() => TournamentModel, {foreignKey: {name: "tournamentId", allowNull: false}})
    tournament: TournamentModel;
}