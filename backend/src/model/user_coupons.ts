import sequelize from '../database/connect_to_db';
import { DataTypes, Model } from "sequelize";

enum CouponStatus {
    ACTIVE = 'active',
    REDEEMED = 'redeemed'
}

class UserCoupon extends Model{
    declare userId: number;
    declare couponId: number;
    declare purchasedAt: Date;
    declare couponStatus: CouponStatus
}

UserCoupon.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'user_id'
    },
    couponId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'coupon_id'
    },
    purchasedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'purchased_at'
    },
    couponStatus: {
        type: DataTypes.ENUM(...Object.values(CouponStatus)),
        allowNull: false,
        defaultValue: CouponStatus.ACTIVE,
        field: 'coupon_status',
    },
},{
    sequelize,
    modelName: 'UserCoupon',
    tableName: 'user_coupons',
    timestamps: false
});

export default UserCoupon;