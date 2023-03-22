[AVM]: https://en.avm.de/
[Fritz!Box]: https://en.avm.de/products/fritzbox/
[MyFritz!]: https://en.avm.de/guide/myfritz-secure-access-to-your-data-anytime-anywhere/
[CloudflareWorkers]: https://www.cloudflare.com/learning/serverless/glossary/serverless-and-cloudflare-workers/

# Cloudflare-Worker-FritzBox-DynDNS
A simple Cloudflare Worker script to update your IP address using the build-in Fritz!Box DynDNS.

## Why this script?
Why I did even wrote this script in the first place? There is already a service from [AVM] (the company behind [Fritz!Box]) called [MyFritz!] which does exactly that... Well, since I manage my domains with Cloudflare, I wanted to avoid an extra service where I need an extra account again. And since I already manage my domains via Cloudflare, I chose a Cloudflare Worker.

> <picture>
>   <source media="(prefers-color-scheme: light)" srcset="https://github.com/Mqxx/GitHub-Markdown/blob/main/blockquotes/badge/light-theme/info.svg">
>   <img alt="Info" src="https://github.com/Mqxx/GitHub-Markdown/blob/main/blockquotes/badge/dark-theme/info.svg">
> </picture><br>
> If you already have a MyFritz! account from AVM and you are using this account actively, then you can use <a href="https://en.avm.de/service/knowledge-base/dok/FRITZ-Box-7590/1018_Determining-the-MyFRITZ-address-to-directly-access-FRITZ-Box-and-home-network-from-the-internet/">their own DynDNS service</a>, which is provided directly by AVM. 

## What even is a Cloudflare Worker?
A Cloudflare Worker is basically just a script that is stored under a certain URL and is executed when this URL is called. Or rather, that's what we use it for. Cloudflare Workers can do so much more. For more info, check out [this overview][CloudflareWorkers] to see what else you can use Cloudflare Workers for.

## Getting started
Okay, but now let's begin. In this guide I will explain how you can set up your own DynDNS service using a free Cloudflare Worker. I will go into all the steps that are necessary to create the Worker and how to set the service up correctly.

### Create Account/Login
To get started you need a Cloudflare Acoount (if you don't already have one). Go to [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) to sign up or sign in with an existing account at [dash.cloudflare.com/login](https://dash.cloudflare.com/login).

### Create first Worker
After you log in/register you should land on your dahboard. On the left hand side you should now see a menu point called "Workers". Click on this item. When you create a worker for the very first time you will land on the example page with the "Hello World sample worker" which looks something like this:

![image](https://user-images.githubusercontent.com/62719703/227031152-d47203c4-4011-4057-a4c7-c1887737fc2f.png)

Click on "Create Worker" below.

![image](https://user-images.githubusercontent.com/62719703/227032045-5cac4038-30c9-4581-8ae1-9364c6535043.png)

Then after that you will be taken directly to the "Quick Edit" view of the created Worker. On the left side you can see which code is executed inside the Worker. That means which code is responsible for our DynDNS service in the end. Now delete the code template example that was automatically added when you created it and replace it [with the code from this repository](./worker.log.js).

After replacing the template with the code from the repository, click on the "Save and deploy" button at the bottom.

##### Base URL:
`https://<Worker Subdomain>.<Worker name>.workers.dev/`

##### URL parameters:
- `token=<pass>`
- `zoneID=<username>`
- `ipv4address=<ipaddr>`
- `ipv4name=<domain>`
- `ipv4proxied=[true|false]`
- `ipv4ttl=1 (auto)`
- `ipv6address=<ip6addr>`
- `ipv6name=<domain>`
- `ipv6proxied=[true|false]`
- `ipv6ttl=1 (auto)`

# ⚠ Work in progress! ⚠
## I am currently working on a good documentation for the script!
