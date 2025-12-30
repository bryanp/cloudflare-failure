import { Container, getRandom } from "@cloudflare/containers";

// Set to 1 so it's easier to reproduce the issue.
const INSTANCE_COUNT = 1;

export class Backend extends Container {
  defaultPort = 8080;
  sleepAfter = "10s";
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api")) {
      try {
        const containerInstance = await getRandom(env.BACKEND, INSTANCE_COUNT);
        console.log("got instance with state", await containerInstance.getState());
        const result = await containerInstance.fetch(request);

        // Even when the proxy fails the container instance reports its state as healthy.
        console.log("got result status with state", result.status, await containerInstance.getState());
        return result;
      } catch (error) {
        // Proxy errors are never raised, they are simply returned as 500s.
        console.error("fetch error", error);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
