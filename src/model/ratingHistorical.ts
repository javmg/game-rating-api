import {Table} from "sequelize-typescript"
import RatingAbstractModel from "./abstract/ratingAbstract";

@Table({tableName: "rating_historical", underscored: true, timestamps: false})
export default class RatingHistoricalModel extends RatingAbstractModel {

}