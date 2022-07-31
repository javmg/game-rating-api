import {Column, DataType, Model, PrimaryKey, Table, Unique} from "sequelize-typescript"

@Table({tableName: "user", underscored: true, timestamps: false})
export default class UserModel extends Model {

    @PrimaryKey
    @Column({primaryKey: true, allowNull: false, type: DataType.UUID, defaultValue: DataType.UUIDV4})
    id: string;

    @Unique
    @Column({allowNull: false, type: DataType.STRING})
    username: string;

    @Column({allowNull: false, type: DataType.STRING})
    type: "admin" | "player";

    @Column({allowNull: true, type: DataType.STRING})
    firstName?: string;

    @Column({allowNull: true, type: DataType.STRING})
    lastName?: string;

    @Column({allowNull: false, type: DataType.STRING})
    email: string;

    @Column({allowNull: false, type: DataType.STRING})
    passwordHashed: string;
}