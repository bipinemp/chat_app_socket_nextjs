import { z } from "zod";

export const FriendRequest = z.object({
  requesterId: z
    .string({ required_error: "Sender ID is required" })
    .min(1, { message: "Sender ID is required" }),
  receiverId: z
    .string({ required_error: "Receiver ID is required" })
    .min(1, { message: "Receiver ID is required" }),

  status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]).optional(),
});

export type TFriendRequest = z.infer<typeof FriendRequest>;

export const MessageType = z.object({
  senderId: z
    .string({ required_error: "Sender ID is required" })
    .min(1, { message: "Sender ID is required" }),
  receiverId: z
    .string({ required_error: "Receiver ID is required" })
    .min(1, { message: "Receiver ID is required" }),
  message: z
    .string({ required_error: "Message is required" })
    .min(1, { message: "Message is required" }),
  image: z.string().optional(),
  username: z.string().optional(),
});
