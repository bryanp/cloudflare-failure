Simple example illustrating issues with Cloudflare Containers.

Reproduce by doing the following:

- Open https://failure-example.proc-82e.workers.dev/, wait for widgets to load
- Wait ~10s, refresh the page, see HTTP 500 errors in the browser console

The returned error looks like:

> Error proxying request to container: The container is not listening in the TCP address 10.0.0.1:8080

You can find a HAR file at `./failure-example.proc-82e.workers.dev.har`.

Logs from `wrangler tail` look like this:

```
Backend.getState - Ok @ 12/30/2025, 11:06:30 AM
GET https://failure-example.proc-82e.workers.dev/api/widgets - Ok @ 12/30/2025, 11:06:36 AM
GET https://failure-example.proc-82e.workers.dev/api/widgets - Ok @ 12/30/2025, 11:06:36 AM
  (log) got instance with state { status: 'stopped', lastChange: 1767121590147 }
  (log) got result 200 { status: 'healthy', lastChange: 1767121600707 }
Alarm @ 12/30/2025, 11:06:37 AM - Ok
  (debug) Error checking 8080: The container is not listening in the TCP address 10.0.0.1:8080
  (log) Port 8080 is ready
Backend.getState - Ok @ 12/30/2025, 11:06:40 AM
Alarm @ 12/30/2025, 11:06:47 AM - Ok
Alarm @ 12/30/2025, 11:06:47 AM - Exception Thrown
Alarm @ 12/30/2025, 11:06:50 AM - Ok
Backend.getState - Ok @ 12/30/2025, 11:06:50 AM                                                                                GET https://failure-example.proc-82e.workers.dev/api/widgets - Ok @ 12/30/2025, 11:06:53 AM                                      (error) Error proxying request to container 7f218029a8aa27f190c30e1241a56b889e3638efe4ed9c082e354903580bfa44: Error: The container is not listening in the TCP address 10.0.0.1:8080
GET https://failure-example.proc-82e.workers.dev/api/widgets - Ok @ 12/30/2025, 11:06:53 AM
  (log) got instance with state { status: 'healthy', lastChange: 1767121600707 }
  (log) got result 500 { status: 'healthy', lastChange: 1767121600707 }
Backend.getState - Ok @ 12/30/2025, 11:06:53 AM
Alarm @ 12/30/2025, 11:06:50 AM - Ok
Alarm @ 12/30/2025, 11:06:50 AM - Exception Thrown
Alarm @ 12/30/2025, 11:07:00 AM - Ok
Alarm @ 12/30/2025, 11:07:00 AM - Exception Thrown                                                                             Alarm @ 12/30/2025, 11:07:03 AM - Ok
Alarm @ 12/30/2025, 11:07:03 AM - Ok
Alarm @ 12/30/2025, 11:07:03 AM - Exception Thrown
Alarm @ 12/30/2025, 11:07:07 AM - Ok
Alarm @ 12/30/2025, 11:07:07 AM - Exception Thrown
```

State seemingly has an internal consistency issue causing instances to be returned even if they are unhealthy. I'm unsure how to detect and/or recover from this. Without a solution I cannot trust containers in production as they will consistently throw errors around shutdown/replacement.
