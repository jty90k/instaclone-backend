import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../../client.js";

export default {
  Mutation: {
    editProfile: async (
      _,
      { firstName, lastName, username, email, password: newPassword },
      { loggedInUser, protectResolver }
    ) => {
      protectResolver(loggedInUser);
      // hass passord
      let uglyPassowrd = null;
      if (newPassword) {
        uglyPassowrd = await bcrypt.hash(newPassword, 10);
      }
      const updateUser = await client.user.update({
        where: {
          id: loggedInUser.id,
        },
        data: {
          firstName,
          lastName,
          username,
          email,
          ...(uglyPassowrd && { password: uglyPassowrd }),
        },
      });
      if (updateUser) {
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
          error: "Could not update user's update profile",
        };
      }
    },
  },
};
