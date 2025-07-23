import mongoose, { Schema, models } from 'mongoose';
// Define subscription types and plans for the system
export var UserType;
(function (UserType) {
    UserType["OWNER"] = "owner";
    UserType["DEALER"] = "dealer";
    UserType["BUYER"] = "buyer";
})(UserType || (UserType = {}));
export var PlanType;
(function (PlanType) {
    PlanType["FREE"] = "free";
    PlanType["BASIC"] = "basic";
    PlanType["STANDARD"] = "standard";
    PlanType["PREMIUM"] = "premium";
    PlanType["BOSS"] = "boss";
})(PlanType || (PlanType = {}));
const subscriptionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    userType: {
        type: String,
        enum: Object.values(UserType),
        required: true
    },
    planType: {
        type: String,
        enum: Object.values(PlanType),
        required: true,
        default: PlanType.FREE
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true,
        default: function () {
            const date = new Date();
            date.setMonth(date.getMonth() + 1); // Default 1 month subscription
            return date;
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    autoRenew: {
        type: Boolean,
        default: false
    },
    listings: {
        total: {
            type: Number,
            required: true,
            default: function () {
                // Set default based on user type and plan
                const { userType, planType } = this;
                if (userType === UserType.OWNER) {
                    if (planType === PlanType.FREE)
                        return 2;
                    if (planType === PlanType.BASIC)
                        return 4;
                    if (planType === PlanType.STANDARD)
                        return 8;
                    if (planType === PlanType.PREMIUM)
                        return 15;
                }
                if (userType === UserType.DEALER) {
                    if (planType === PlanType.FREE)
                        return 1;
                    if (planType === PlanType.BASIC)
                        return 4;
                    if (planType === PlanType.STANDARD)
                        return 8;
                    if (planType === PlanType.PREMIUM)
                        return 15;
                }
                return 0;
            }
        },
        used: {
            type: Number,
            default: 0
        },
        refreshDate: {
            type: Date,
            default: function () {
                // Free listings refresh every 3 months
                if (this.planType === PlanType.FREE) {
                    const date = new Date();
                    date.setMonth(date.getMonth() + 3);
                    return date;
                }
                return null;
            }
        }
    },
    contacts: {
        total: {
            type: Number,
            required: true,
            default: function () {
                // Set default based on user type and plan
                const userType = this.userType;
                const planType = this.planType;
                if (userType === UserType.BUYER) {
                    if (planType === PlanType.FREE)
                        return 10;
                    if (planType === PlanType.BOSS && this.price === 1000)
                        return 10;
                    if (planType === PlanType.BOSS && this.price === 2000)
                        return 20;
                    if (planType === PlanType.BOSS && this.price === 10000)
                        return 100;
                }
                return 0;
            }
        },
        used: {
            type: Number,
            default: 0
        },
        refreshDate: {
            type: Date,
            default: function () {
                // Free contacts refresh every 9 months for buyers
                if (this.userType === UserType.BUYER && this.planType === PlanType.FREE) {
                    const date = new Date();
                    date.setMonth(date.getMonth() + 9);
                    return date;
                }
                return null;
            }
        }
    },
    features: {
        ai: {
            type: Boolean,
            default: function () {
                const userType = this.userType;
                const planType = this.planType;
                // Basic description AI is available to all
                if (planType === PlanType.FREE)
                    return false;
                if (userType === UserType.OWNER) {
                    if (planType === PlanType.BASIC)
                        return false;
                    return true; // STANDARD and PREMIUM
                }
                if (userType === UserType.DEALER) {
                    if (planType === PlanType.BASIC)
                        return false;
                    return true; // STANDARD and PREMIUM
                }
                return false;
            }
        },
        aiInsights: {
            type: Boolean,
            default: function () {
                const userType = this.userType;
                const planType = this.planType;
                if (planType === PlanType.FREE)
                    return false;
                if (userType === UserType.OWNER) {
                    if (planType === PlanType.BASIC)
                        return false;
                    if (planType === PlanType.STANDARD)
                        return true;
                    if (planType === PlanType.PREMIUM)
                        return true;
                }
                if (userType === UserType.DEALER) {
                    if (planType === PlanType.BASIC)
                        return false;
                    if (planType === PlanType.STANDARD)
                        return true;
                    if (planType === PlanType.PREMIUM)
                        return true;
                }
                return false;
            }
        },
        virtual360: {
            type: Boolean,
            default: function () {
                const planType = this.planType;
                return planType !== PlanType.FREE;
            }
        },
        virtualTour: {
            type: Boolean,
            default: function () {
                const userType = this.userType;
                const planType = this.planType;
                if (planType === PlanType.FREE)
                    return false;
                if (userType === UserType.OWNER) {
                    if (planType === PlanType.BASIC)
                        return true;
                    return true; // STANDARD and PREMIUM
                }
                if (userType === UserType.DEALER) {
                    if (planType === PlanType.BASIC)
                        return true;
                    return true; // STANDARD and PREMIUM
                }
                return false;
            }
        },
        featured: {
            type: Boolean,
            default: function () {
                const planType = this.planType;
                return planType !== PlanType.FREE;
            }
        },
        topFeatured: {
            type: Boolean,
            default: function () {
                const userType = this.userType;
                const planType = this.planType;
                if (userType === UserType.OWNER) {
                    return planType === PlanType.STANDARD || planType === PlanType.PREMIUM;
                }
                if (userType === UserType.DEALER) {
                    return planType === PlanType.STANDARD || planType === PlanType.PREMIUM;
                }
                return false;
            }
        },
        homePageFeatured: {
            type: Boolean,
            default: function () {
                const planType = this.planType;
                return planType === PlanType.PREMIUM;
            }
        },
        customerCare: {
            type: Boolean,
            default: function () {
                const planType = this.planType;
                return planType === PlanType.PREMIUM;
            }
        }
    },
    paymentHistory: [
        {
            transactionId: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            },
            status: {
                type: String,
                enum: ['pending', 'completed', 'failed', 'refunded'],
                default: 'completed'
            }
        }
    ]
}, {
    timestamps: true
});
// Create indexes for efficient querying
subscriptionSchema.index({ isActive: 1 });
subscriptionSchema.index({ endDate: 1 });
subscriptionSchema.index({ 'paymentHistory.transactionId': 1 });
// Pre-save middleware to ensure defaults are set correctly
subscriptionSchema.pre('save', function (next) {
    // Update listings.total based on userType and planType if not already set
    if (this.isNew || this.isModified('planType') || this.isModified('userType')) {
        const userType = this.userType;
        const planType = this.planType;
        // Set listings total
        if (userType === UserType.OWNER) {
            if (planType === PlanType.FREE)
                this.listings.total = 2;
            else if (planType === PlanType.BASIC)
                this.listings.total = 4;
            else if (planType === PlanType.STANDARD)
                this.listings.total = 8;
            else if (planType === PlanType.PREMIUM)
                this.listings.total = 15;
        }
        else if (userType === UserType.DEALER) {
            if (planType === PlanType.FREE)
                this.listings.total = 1;
            else if (planType === PlanType.BASIC)
                this.listings.total = 4;
            else if (planType === PlanType.STANDARD)
                this.listings.total = 8;
            else if (planType === PlanType.PREMIUM)
                this.listings.total = 15;
        }
        // Set the refresh date for free plans
        if (planType === PlanType.FREE) {
            const refreshDate = new Date();
            refreshDate.setMonth(refreshDate.getMonth() + 3);
            this.listings.refreshDate = refreshDate;
        }
        // Set contacts total for buyers
        if (userType === UserType.BUYER) {
            if (planType === PlanType.FREE) {
                this.contacts.total = 10;
                const refreshDate = new Date();
                refreshDate.setMonth(refreshDate.getMonth() + 9);
                this.contacts.refreshDate = refreshDate;
            }
            else if (planType === PlanType.BOSS) {
                if (this.price === 1000)
                    this.contacts.total = 10;
                else if (this.price === 2000)
                    this.contacts.total = 20;
                else if (this.price === 10000)
                    this.contacts.total = 100;
            }
        }
    }
    next();
});
const Subscription = models.Subscription || mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
