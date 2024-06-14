import mongoose from "mongoose";
const Event = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    eventTags: {
      type: [String],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    groupType: {
      type: String,
      enum: ["club", "society", "community"],
      required: true,
    },
    groupId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const EventModel = mongoose.model("Event", Event);

export default { EventModel };

export const getEventById = (eventId: string) => {
  return EventModel.findById(eventId);
};
export const createnewEvent = (values: Record<string, any>) => {
  return new EventModel(values).save().then((event) => event.toObject());
};

export const getallEvents = (groupId: string, groupType: string) => {
  return EventModel.find({ groupId, groupType });
};
