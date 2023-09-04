import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";


const handle = async (req, res) => {
  await mongooseConnect();

  const { method } = req;

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await User.findOne({ _id: req.query.id }));
    } else {
      res.json(await User.find());
    }
  }

  if (method === "POST") {
    const { userName, email, password, image } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(req.body);
    const userDoc = await User.create({
      userName,
      email,
      password: hashedPassword,
      image,
    });
    res.json(userDoc);
  }
};

export default handle;
