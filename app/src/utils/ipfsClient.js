import { PROJECT_ID, PROJECT_SECRET } from "@/apiConfig";
import { create } from "ipfs-http-client";

const auth =
  "Basic " + Buffer.from(PROJECT_ID + ":" + PROJECT_SECRET).toString("base64");

const ipfsClient = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  apiPath: "/api/v0",
  headers: {
    authorization: auth,
  },
});

export default ipfsClient;
