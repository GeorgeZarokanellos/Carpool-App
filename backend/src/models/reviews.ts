import sequelize from "../database/connect_to_db";
import { Model, DataTypes } from "sequelize";

class Reviews extends Model {
    declare reviewId: number;
    declare rating: number;
    declare reviewDate: Date;
    declare reviewedPersonId: number;
    declare reviewerId: number;
}

Reviews.init({
    reviewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'review_id'
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'rating'
    },
    reviewDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'review_date'
    },
    reviewedPersonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'reviewed_user_id'
    },
    reviewerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'reviewer_id'
    }
}, {
    sequelize,
    modelName: 'reviews',
    tableName: 'reviews',
    timestamps: false,  
});

export default Reviews;