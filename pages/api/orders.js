import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { Order } from "@/models/Order";
import { authOptions } from "./auth/[...nextauth]";

const handle = async (req, res) => {
  await mongooseConnect();
  const session = await getServerSession(req, res, authOptions);

  res.json(await Order.find({ userEmail: session?.user?.email }));
};
export default handle;
//{ userEmail: user?.email }
