import {Table} from "sequelize-typescript"
import RatingAbstractModel from "./abstract/ratingAbstract";

@Table({tableName: "rating_current", underscored: true, timestamps: false})
export default class RatingCurrentModel extends RatingAbstractModel {

}