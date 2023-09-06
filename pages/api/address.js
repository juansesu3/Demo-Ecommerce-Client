import { mongooseConnect } from "@/lib/mongoose";
import { Address } from "@/models/Address";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

const handle = async (req, res) => {
  await mongooseConnect();
  const { user } = await getServerSession(req, res, authOptions);

  if (req.method === "PUT") {
    const address = await Address.findOne({ userEmail: user.email });
    if (address) {
      res.json(await Address.findByIdAndUpdate(address._id, req.body));
    } else {
      res.json(await Address.create({ userEmail: user.email, ...req.body }));
    }
  }
  if (req.method === "GET") {
    const address = await Address.findOne({ userEmail: user.email });
    res.json(address);
  }
};
export default handle;
