async function p(t, i) {
  let a = t.route(
    '/resetCache',
    e => (
      t.invalidateCache('weather-Iceland'),
      t.invalidateCache('weather-Tobago'),
      t.invalidateCache('weather-Kyoto'),
      new Response(`You made a ${e.method} request`)
    )
    console.log(":::: exposes an endpoint at", a);
    let l = t.proxy("/gate/*", "http://n-gate.com");
    console.log(`:::: proxies ${l} to http://n-gate.com`);
    let d = t.serve("/cheese", "assets/Camembert.jpg");
    console.log(`:::: serves a file at ${d}`), i.ecommerce && t.addEventListener("ecommerce", e => {
        console.log("event:", e), e.name === "Purchase" && console.info("Ka-ching! \u{1F4B0}", e.payload)
    }), t.addEventListener("request", e => {
        console.log("event:", e.payload), console.log("\u{1F6D2} \u{1F9F1} Triggered by every request")
    }), t.addEventListener("response", e => {
        console.log("event:", e.payload), console.log("\u{1F6D2} \u{1F381} Doing something on response")
    }), t.addEventListener("remarketing", e => {
        console.log("event:", e.payload), console.log("\u{1F6D2} Remarketing event was sent to demo component")
    }), t.createEventListener("mousemove", async e => {
        let {
            payload: o
        } = e;
        console.info("\u{1F401} \u{1FAA4} Mousemove:", JSON.stringify(o, null, 2))
    }), t.createEventListener("mousedown", async e => {
        let {
            client: o,
            payload: n
        } = e;
        console.info("\u{1F401} \u2B07\uFE0F Mousedown payload:", n);
        let [s] = n.mousedown;
        o.set("lastClickX", s.clientX), o.set("lastClickY", s.clientY)
    }), t.createEventListener("historyChange", async e => {
        console.info("\u{1F4E3} Ch Ch Ch Chaaanges to history detected!", e.payload)
    }), t.createEventListener("resize", async e => {
        console.info("\u{1FA9F} New window size!", JSON.stringify(e.payload, null, 2))
    }), t.createEventListener("scroll", async e => {
        console.info("\u{1F6DE}\u{1F6DE}\u{1F6DE} They see me scrollin...they hatin...", JSON.stringify(e.payload, null, 2))
    }), t.createEventListener("resourcePerformanceEntry", async e => {
        console.info("Witness the fitness - fresh resource performance entries", JSON.stringify(e.payload, null, 2))
    }), t.addEventListener("clientcreated", ({
        client: e
    }) => {
        if (console.log("clientcreated!: \u{1F423}"), !e.get("clientNumber")) {
            let n = Math.random();
            e.set("clientNumber", n.toString())
        }
        e.attachEvent("mousemove"), e.attachEvent("mousedown"), e.attachEvent("historyChange"), e.attachEvent("scroll"), e.attachEvent("resize"), e.attachEvent("resourcePerformanceEntry")
    }), t.addEventListener("event", async e => {
        let {
            client: o,
            payload: n
        } = e;
        if (n.name === "cheese" && (console.info("\u{1F9C0}\u{1F9C0}  cheese event! \u{1F9C0}\u{1F9C0}"), o.execute('console.log("\u{1F9C0}\u{1F9C0}  cheese event! \u{1F9C0}\u{1F9C0}")')), n.user_id = o.get("user_id"), Object.keys(n || {}).length) {
            let s = new URLSearchParams(n).toString();
            t.fetch(`http://www.example.com/?${s}`)
        }
    }), t.addEventListener("pageview", async e => {
        let {
            client: o
        } = e;
        console.info("\u{1F4C4} Pageview received!", o.get("user_id"), o.get("last_page_title"), o.get("session_id"));
        let n = o.url.searchParams.get("user_id");
        o.set("user_id", n, {
            scope: "infinite"
        }), o.title && o.set("last_page_title", o.title, {
            scope: "page"
        }), o.set("session_id", "session_date_" + new Date().toUTCString(), {
            scope: "session"
        }), o.return("Some very important value"), o.execute('console.info("Page view processed by Demo Component")'), o.fetch("http://example.com", {
            mode: "no-cors"
        })
    }), t.registerEmbed("weather-example", async ({
        parameters: e
    }) => {
        let o = e.location;
        return await t.useCache("weather-" + o, async () => {
            try {
                let c = await (await t.fetch(`https://wttr.in/${o}?format=j1`)).json(),
                    [r] = c.current_condition,
                    {
                        temp_C: h
                    } = r;
                return `<p>Temperature in ${o} is: ${h} &#8451;</p>`
            } catch (s) {
                console.error("error fetching weather for embed:", s)
            }
        })
    }), t.registerWidget(async () => {
        let e = "Colombia";
        return await t.useCache("weather-" + e, async () => {
            try {
                let s = await (await t.fetch(`https://wttr.in/${e}?format=j1`)).json(),
                    [c] = s.current_condition,
                    {
                        temp_C: r
                    } = c;
                return `<p>Temperature in ${e} is: ${r} &#8451;</p>`
            } catch (n) {
                console.error("error fetching weather for widget:", n)
            }
        })
    })
}
export {
    p as
    default
};