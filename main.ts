import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import axiod from "https://deno.land/x/axiod@0.26.1/mod.ts";

import { WebrookMovidesk } from "./types.ts"

const app = new Application();
const router = new Router();

app.use(router.routes());
app.use(router.allowedMethods());


async function getProfileFromVault(token:string) {
    const { data } = await axiod.get("https://vault.unisec.com.br/v1/identity/oidc/provider/default/userinfo", {
      headers: {
        Authorization: `${token}`,
        Accept: "application/json",
      },
    });
    return {email: data.contact.email, id: data.id }
  }

async function getUserFromVault(email:string) {
try {
    const { data } = await axiod.get(
    `https://vault.unisec.com.br/v1/smarthome/data/${email}`,
    {
        headers: {
        'X-Vault-Token': Deno.env.get("VAULT_TOKEN"),
        'Content-Type': 'application/json'
        }
    }
    );

    return {
    url: data.data.data.url,
    token: data.data.data.token,
    };
} catch (error:any) {
    console.log(`O E-mail ${email} não foi encontrado na base de dados`);
}
}

async function sendResquestSmarthomeCustomer(url:string, token:string, payload:string) {
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
    const { data } = await axiod.post(`${url}/api/google_assistant`, payload, {
      timeout: 1000,
      headers,
    });
    return data;
  }
  


router.post("/webhook-vitale-residence", async ({request,response}) => {    

    const authorization =  request.headers.get("Authorization") as string
    const payload =  await request.body({type: "json"}).value as any
    
    const { email } = await getProfileFromVault(authorization)
    console.log(email)
    const {url,token} = await getUserFromVault(email) as {url:string, token: string}
    console.log(url,token)
    console.log(payload)
    return response.body = await sendResquestSmarthomeCustomer(url,token,payload)
});

router.post("/webhook", async ({request,response}) => {    

    const payload: WebrookMovidesk = await request.body({type:'json'}).value 
    
    const data = {
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": payload.Subject
                }
            },
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": `*Status*: ${payload.Status}`
                    }
                ]
            }
        ]
    }

    await axiod.post(
        Deno.env.get("SLACK_WEBHOOK_URL") as string,
        data,
        {
            headers: { "Content-type": " application/json" },
            timeout: 1000
        }
    )

    response.status = 200
});

app.addEventListener( "listen", () => { 
    console.log("Ouvindo em Webhooks https://movidesk.deno.dev/webhook ")
});

await app.listen({ port: 8080 })