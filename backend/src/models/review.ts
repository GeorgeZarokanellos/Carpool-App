import sequelize from "../database/connect_to_db";
import { Model, DataTypes } from "sequelize";

class Review extends Model {
    declare reviewId: number;
    declare reviewRating: number;
    declare reviewDateTime: Date;
    declare reviewedUserId: number;
    declare reviewerId: number;
}

Review.init({
    reviewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'review_id'
    },
    reviewRating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'rating'
    },
    reviewDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'review_date'
    },
    reviewedUserId: {
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

export default Review;