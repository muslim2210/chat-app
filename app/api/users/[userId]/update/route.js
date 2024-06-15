import User from "@/models/User";
import { connectToDB } from "@/mongodb";

export const POST = async (request, { params }) => {
  try {
    await connectToDB();
    const { userId } = params;

    const body = await request.json();

    const { username, profileImage } = body;

    const updateUser = await User.findByIdAndUpdate(
      userId,
      { username, profileImage },
      { new: true }
    );

    return new Response(JSON.stringify(updateUser), { status: 200 });
  } catch (err) {
    return new Response("Failed to update user", { status: 500 });
  }
};
