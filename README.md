[AVM]: https://en.avm.de/
[Fritz!Box]: https://en.avm.de/products/fritzbox/
[MyFritz!]: https://en.avm.de/guide/myfritz-secure-access-to-your-data-anytime-anywhere/
[CloudflareWorkers]: https://www.cloudflare.com/learning/serverless/glossary/serverless-and-cloudflare-workers/
[DynDNS]: https://en.avm.de/service/knowledge-base/dok/FRITZ-Box-7590/1018_Determining-the-MyFRITZ-address-to-directly-access-FRITZ-Box-and-home-network-from-the-internet/
[encodeURI]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI

# Cloudflare Worker Fritz!Box DynDNS
A simple Cloudflare Worker script to update your IP address using the build-in Fritz!Box DynDNS.

## Why this script?
Why I did even wrote this script in the first place? There is already a service from [AVM] (the company behind [Fritz!Box]) called [MyFritz!] which does exactly that... Well, since I manage my domains with Cloudflare, I wanted to avoid an extra service where I need an extra account again. And since I already manage my domains via Cloudflare, I chose a Cloudflare Worker.

> <picture>
>   <source media="(prefers-color-scheme: light)" srcset="https://github.com/Mqxx/GitHub-Markdown/blob/main/blockquotes/badge/light-theme/info.svg">
>   <img alt="Info" src="https://github.com/Mqxx/GitHub-Markdown/blob/main/blockquotes/badge/dark-theme/info.svg">
> </picture><br>
>
> If you already have a MyFritz! account from AVM and you are using this account actively, then you can use [their own DynDNS service][DynDNS], which is provided directly by AVM. 

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

### Edit Worker
Then after that you will be taken directly to the "Quick Edit" view of the created Worker. On the left side you can see which code is executed inside the Worker. That means which code is responsible for our DynDNS service in the end. Now delete the code template example that was automatically added when you created it and replace it [with the code from this repository](./worker.log.js).

> <picture>
>   <source media="(prefers-color-scheme: light)" srcset="https://github.com/Mqxx/GitHub-Markdown/blob/main/blockquotes/badge/light-theme/info.svg">
>   <img alt="Info" src="https://github.com/Mqxx/GitHub-Markdown/blob/main/blockquotes/badge/dark-theme/info.svg">
> </picture><br>
> 
> Optionally you can also use the [minified version](./worker.min.js) of the script.

After replacing the template with the code from the repository, click on the "Save and deploy" button at the bottom. If you have done everything right, you should be automatically returned to your account home page. Going again back to the left side in the menu under Workers, you should see your newly created Worker.

![image](https://user-images.githubusercontent.com/62719703/227037626-b7748d8f-902d-4c06-b336-28946f08cac3.png)

### Quick-Edit existing Worker
You can edit your worker at any time using the "Quick edit" button.

![image](https://user-images.githubusercontent.com/62719703/227038479-6cdafdb6-30d2-4e2c-8ca2-364058a83df4.png)

### Changing Sub-Domain for Workers
You can also change the sub-domain for all the Workers for your account. To do this, go back to the home page for all workers. Then on the right side you can change the sub-domain.

![image](https://user-images.githubusercontent.com/62719703/227036851-1d33cc56-177e-452f-98e8-46aa88fabdfd.png)


## Using the script/request URL
Next, we'll look at how to properly use the Worker's request URL. We will also take a look at how to correctly enter the update URL into your Fritz!Box. Let's look at the basic structure of the request URL. The URL is structured as follows:

| Worker subdomain | Account name | Cloudflare Worker domain |
|:----------------:|:------------:|:------------------------:|
|  `<subdomain>`   |   `<name>`   |      `workers.dev/`      |

> <picture>
>   <source media="(prefers-color-scheme: light)" srcset="https://github.com/Mqxx/GitHub-Markdown/blob/main/blockquotes/badge/light-theme/info.svg"/>
>   <img alt="Info" src="https://github.com/Mqxx/GitHub-Markdown/blob/main/blockquotes/badge/dark-theme/info.svg"/>
> </picture><br>
>
> An example would look like this: `https://random-name.your-account.workers.dev`

The following parameters can be used in the URL:

|   Parameter   | Datatype | Required |                           Description                           |
|:-------------:|:--------:|:--------:|:----------------------------------------------------------------|
|    `token`    |  string  |    yes   | Token for the Cloudflare API                                    |
|    `zoneid`   |  string  |    yes   | ID for the DNS Zone                                             |
| `ipv4address` |  string  |    yes   | IPv4 address to update                                          |
|   `ipv4name`  |  string  |    yes   | IPv4 domain name                                                |
| `ipv4proxied` |  boolean |    no    | If the IPv4 connection should be proxied                        |
|   `ipv4ttl`   |  number  |    no    | IPv4 Time to live (1 = Auto, 60-86400 = Valid range)            |
| `ipv6address` |  string  |    no    | IPv6 address to update                                          |
|   `ipv6name`  |  string  |  (yes)*  | IPv6 domain name (*Only required if `ipv6address` is specified) |
| `ipv6proxied` |  boolean |    no    | If the IPv6 connection should be prodied                        |
|   `ipv6ttl`   |  number  |    no    | IPv6 Time to live (1 = Auto, 60-86400 = Valid range)            |
|   `comment`   |  string  |    no    | Comment for the created/updated record                          |

Parameters are simply appended to the request URL with a `?`. Between the parameters are `&` characters. For more information, please reference [this article from MDN][encodeURI] on how to properly encode URL parameters.

> <picture>
>   <source media="(prefers-color-scheme: light)" srcset="https://github.com/Mqxx/GitHub-Markdown/blob/main/blockquotes/badge/light-theme/info.svg"/>
>   <img alt="Info" src="https://github.com/Mqxx/GitHub-Markdown/blob/main/blockquotes/badge/dark-theme/info.svg"/>
> </picture><br>
>
> An example with the parameters would look like this:<br>
> `https://random-name.your-account.workers.dev?token=abc1234&zoneid=1234&ipv4address=<ipaddr>&ipv4name=example.com`

# ⚠ Work in progress! ⚠
## I am currently working on a good documentation for the script!

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

