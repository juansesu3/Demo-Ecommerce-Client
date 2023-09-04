import { mongooseConnect } from "@/lib/mongoose";
import { WishedProduct } from "@/models/WishedProducts";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

const handle = async (req, res) => {
  await mongooseConnect();
  const session = await getServerSession(req, res, authOptions);
  console.log("Session Api wishList >> ", { session });

  if (req.method === "POST") {
    const { product } = req.body;
    const wisheDoc = await WishedProduct.findOne({
      userEmail: session?.user?.email,
      product,
    });
    if (wisheDoc) {
      await WishedProduct.findByIdAndDelete(wisheDoc._id);
      res.json({ wisheDoc });
    } else {
      await WishedProduct.create({
        userEmail: session?.user?.email,
        product,
      });
      res.json("create");
    }
  }
  if (req.method === "GET") {
    res.json(
      await WishedProduct.find({ userEmail: session?.user?.email }).populate(
        "product"
      )
    );
  }
};

export default handle;
