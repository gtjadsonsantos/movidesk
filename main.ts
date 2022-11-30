import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import axiod from "https://deno.land/x/axiod@0.26.1/mod.ts";

import { WebrookMovidesk } from "./types.ts"

const app = new Application();
const router = new Router();

app.use(router.routes());
app.use(router.allowedMethods());

router.get("/webhook-vitale-residence", async ({request,response}) => {    

    console.log(request)

    response.status = 200
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