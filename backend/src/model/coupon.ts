import { Model, DataTypes } from 'sequelize';
import { CouponStatus } from "../interface/interface";
import sequelize from '../database/connect_to_db';

class Coupon extends Model {
    declare couponId: number;
    declare title: string;
    declare description: string;
    declare code: string;
    declare discountValue: number;
    declare pointsCost: number;
    declare createdAt: Date;
}

Coupon.init({
    couponId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'coupon_id'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'title'
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'description'
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'code',
        field: 'code'
    },
    discountValue: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'discount_value'
    },
    pointsCost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'points_cost'
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    }
},{
    sequelize,
    modelName: 'coupon',
    tableName: 'coupons',
    timestamps: false
});

export default Coupon;