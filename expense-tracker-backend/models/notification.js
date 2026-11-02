const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["info", "success", "warning", "danger"],
      default: "info",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    dedupeKey: {
      type: String,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ user: 1, dedupeKey: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Notification", notificationSchema);