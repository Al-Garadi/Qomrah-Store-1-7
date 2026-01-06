
import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function getKey({ container }: ExecArgs) {
    const apiKeyModule = container.resolve(Modules.API_KEY);
    const keys = await apiKeyModule.listApiKeys({ title: "Webshop" });
    if (keys.length > 0) {
        const fs = require("fs");
        fs.writeFileSync("key.txt", keys[0].token);
        console.log("Key written to key.txt");
    } else {
        console.log("No key found");
    }
}
