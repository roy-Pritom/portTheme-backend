import { Schema, model } from "mongoose";
import { TEvent } from "./event.interface";

const eventSchema=new Schema<TEvent>({
    title: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true
      },
      scheduledTime: {
        type: Date,
        required: true
      },
      posted: {
        type: Boolean,
        default: false
      }
})

export const Event=model<TEvent>('Event',eventSchema)