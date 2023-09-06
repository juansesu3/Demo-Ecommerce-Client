import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ProductBox from "@/components/ProductBox";
import Spinner from "@/components/Spinner";
import Tabs from "@/components/Tabs";
import WhiteBox from "@/components/WhiteBox";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import SingleOrder from "@/components/SingleOrder";
import { useRouter } from "next/router";
import Register from "@/components/Register";

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

const ColsWrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  margin-top: 20px;
  gap: 15px;

  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 40px;
    margin: 40px 0;
    p {
      margin: 5px;
    }
  }
`;
const WishedProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const AccountPage = () => {
  const { data: session } = useSession();

  console.log("Session come from useSession() Hokk >> ", { session });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("jane-doe@negiupp.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreeAddres] = useState("");
  const [country, setCountry] = useState("");

  const [addressLoaded, setAddressLoaded] = useState(true);
  const [wishListLoaded, setWishListLoaded] = useState(true);
  const [ordersLoaded, setOrdersLoaded] = useState(true);
  const [wishedProducts, setWishedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("Orders");
  const [orders, setOrders] = useState([]);

  const Logout = async () => {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  };

  const Login = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        name,
        password,
      });

      if (result.error) {
        setError(true);
        console.log(error);
        return;
      }
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  const saveAddress = () => {
    const data = {
      name,
      email,
      city,
      streetAddress,
      postalCode,
      country,
    };
    axios.put("/api/address", data);
  };
  useEffect(() => {
    if (!session) {
      return;
    }
    setAddressLoaded(false);
    setWishListLoaded(false);
    setOrdersLoaded(false);
    axios.get("/api/address").then((response) => {
      console.log(response);
      setName(response.data?.name);
      setEmail(response.data?.userEmail);
      setCity(response.data?.city);
      setPostalCode(response.data?.postalCode);
      setStreeAddres(response.data?.streetAddress);
      setCountry(response.data?.country);
      setAddressLoaded(true);
    });

    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
      setOrdersLoaded(true);
    });

    axios.get("/api/wishList").then((response) => {
      setWishedProducts(response.data.map((wp) => wp.product));
      setWishListLoaded(true);
    });
  }, [session]);

  const productRemovedFromWishList = async (idRemove) => {
    setWishedProducts((products) => {
      return [...products.filter((p) => p._id.toString() !== idRemove)];
    });
  };

  return (
    <>
      <Header />
      <Center>
        <ColsWrapper>
          <div>
            <RevealWrapper delay={0}>
              <WhiteBox>
                <Tabs
                  tabs={["Orders", "Wishlist"]}
                  active={activeTab}
                  onChange={setActiveTab}
                />
                {activeTab === "Orders" && (
                  <>
                    {!ordersLoaded && <Spinner fullWidth={true} />}

                    {ordersLoaded && (
                      <div>
                        {orders.length === 0 && !session && (
                          <p>Login to see your orders</p>
                        )}
                        {orders.length === 0 && session && (
                          <p>
                            What are you waiting for?
                            <br /> The moment is now!
                          </p>
                        )}
                        {orders.length > 0 &&
                          orders.map((o) => <SingleOrder key={o._id} {...o} />)}
                      </div>
                    )}
                  </>
                )}
                {activeTab === "Wishlist" && (
                  <>
                    {!wishListLoaded && <Spinner fullWidth={true} />}
                    {wishListLoaded && (
                      <>
                        <WishedProductGrid>
                          {wishedProducts.length > 0 &&
                            wishedProducts.map((wp) => (
                              <ProductBox
                                key={wp._id}
                                {...wp}
                                wished={true}
                                onRemoveFromWishList={
                                  productRemovedFromWishList
                                }
                              />
                            ))}
                        </WishedProductGrid>
                        {wishedProducts.length === 0 && (
                          <>
                            {session && <p>Your wish list is empty</p>}
                            {!session && (
                              <p>Login to add products to your wishlist</p>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
          <div>
            <RevealWrapper delay={100}>
              <WhiteBox>
                <h2>{session ? "Account Details" : "Login"}</h2>

                {!session && (
                  <Form>
                    <p>
                      <i>If you want to try it!</i>
                    </p>

                    <p>
                      User Name: <strong>jane-doe</strong>
                    </p>
                    <p>
                      Password: <strong>Fr8hL23</strong>
                    </p>
                    <Input
                      type="text"
                      value={name}
                      onChange={(ev) => setName(ev.target.value)}
                      placeholder="user-name here"
                    />
                    <Input
                      type="password"
                      value={password}
                      onChange={(ev) => setPassword(ev.target.value)}
                      placeholder="password here"
                    />
                  </Form>
                )}

                {!addressLoaded && <Spinner fullWidth={true} />}

                {addressLoaded && session && (
                  <>
                    <Form>
                      <Input
                        type="text"
                        placeholder="Name"
                        value={name}
                        name="name"
                        onChange={(ev) => setName(ev.target.value)}
                      />
                      <Input
                        type="text"
                        placeholder="Email"
                        value={email}
                        name="email"
                        onChange={(ev) => setEmail(ev.target.value)}
                      />
                      <CityHolder>
                        <Input
                          type="text"
                          placeholder="City"
                          value={city}
                          name="city"
                          onChange={(ev) => setCity(ev.target.value)}
                        />
                        <Input
                          type="text"
                          placeholder="Postal Code"
                          value={postalCode}
                          name="postalCode"
                          onChange={(ev) => setPostalCode(ev.target.value)}
                        />
                      </CityHolder>
                      <Input
                        type="text"
                        placeholder="Street Addres"
                        value={streetAddress}
                        name="streeAdress"
                        onChange={(ev) => setStreeAddres(ev.target.value)}
                      />
                      <Input
                        type="text"
                        placeholder="Country"
                        value={country}
                        name="country"
                        onChange={(ev) => setCountry(ev.target.value)}
                      />

                      <Button black={1} block={1} onClick={saveAddress}>
                        Save
                      </Button>
                    </Form>
                    <hr />
                  </>
                )}

                {session && (
                  <Button primary={1} onClick={Logout}>
                    Logout
                  </Button>
                )}
                {!session && (
                  <Button primary={1} onClick={Login}>
                    Login
                  </Button>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
        </ColsWrapper>
      </Center>
    </>
  );
};
export default AccountPage;
