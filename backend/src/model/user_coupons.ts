import sequelize from '../database/connect_to_db';
import { DataTypes, Model } from "sequelize";

enum CouponStatus {
    ACTIVE = 'active',
    REDEEMED = 'redeemed'
}

class User_Coupon extends Model{
    declare userId: number;
    declare couponId: number;
    declare purchasedAt: Date;
    declare couponStatus: CouponStatus
}

User_Coupon.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'user_id'
    },
    couponId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'coupon_id'
    },
    purchasedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'coupon_id'
    },
    couponStatus: {
        type: DataTypes.ENUM(...Object.values(CouponStatus)),
        allowNull: false,
        defaultValue: CouponStatus.ACTIVE,
        field: 'coupon_status',
    },
},{
    sequelize,
    modelName: 'userCoupons',
    tableName: 'User_Coupons',
    timestamps: false
});

export default User_Coupon;