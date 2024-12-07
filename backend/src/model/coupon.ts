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
    declare status: CouponStatus;
    declare ownerId: number;
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
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: CouponStatus.ACTIVE,
        field: 'status'
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'owner_id'
    }
},{
    sequelize,
    modelName: 'coupon',
    tableName: 'coupons',
    timestamps: false
});

export default Coupon;