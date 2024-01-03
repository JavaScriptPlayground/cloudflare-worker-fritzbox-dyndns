export default {
    async fetch(request, _) {
        // API endpoint
        const apiEndpoint = "https://api.cloudflare.com/client/v4/";
        // Parameters from the request URL
        const { searchParams } = new URL(request.url);
        const requestURL = {
            // The agent from which the request comes
            userAgent: request.headers.get('user-agent') || 'Unknown agent',
            // API token for Cloudflare
            token: searchParams.get("token") || '',
            // The zone ID where the DNS entry should be added/edited (Cloudflare Dashboard > [Your Domain] > Overview > [In the right section, under API])
            zoneID: searchParams.get("zoneid") || '',
            // The comment for the added/updated record
            comment: searchParams.get("comment") || '',
            // IPv4 parameters
            ipv4: {
                // IPv4 adress
                address: searchParams.get("ipv4address") || '',
                // IPv4 name (domain name)
                name: searchParams.get("ipv4name") || '',
                // If the connection should be proxied
                proxied: ((searchParams.get("ipv4proxied") || 'true') === 'true'),
                // Time to live (TTL), how long the record is valid (1 means auto)
                ttl: parseInt(searchParams.get("ipv4ttl"), 10) || 1
            },
            // IPv6 parameters
            ipv6: {
                // IPv6 adress
                address: searchParams.get("ipv6address") || '',
                // IPv6 name (domain name)
                name: searchParams.get("ipv6name") || '',
                // If the connection should be proxied
                proxied: ((searchParams.get("ipv6proxied") || 'true') === 'true'),
                // Time to live (TTL), how long the record is valid (1 means auto)
                ttl: parseInt(searchParams.get("ipv6ttl"), 10) || 1
            }
        }

        // API request URL
        const apiURL = `${apiEndpoint}zones/${requestURL.zoneID}/dns_records`;
        // API request headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${requestURL.token}`
        }

        // API body comment
        let comment = requestURL.comment.replace(/<userAgent>/gmi, requestURL.userAgent)
        comment = comment.length > 50 ? comment.slice(0, 47) + '...' : comment

        // Log info
        function logInfo(msg) {
            console.log('[\x1B[34mINFO\x1B[0m]: ' + msg);
        }
        // Log ok
        function logOk(msg) {
            console.log('[\x1B[32m OK \x1B[0m]: ' + msg);
        }
        // Log fail
        function logFail(msg) {
            console.log('[\x1B[31mFAIL\x1B[0m]: ' + msg);
        }

        // Get first record ID matching the type and name
        async function getRecordID(type, name) {
            // Get records
            const response = await fetch(`${apiURL}/?type=${type}&name=${name}`, {
                method: 'GET',
                headers: headers
            }).then(response => response.json())
            // Return first record ID
            return response?.result[0]?.id
        }

        // Make API request
        function APIRequest(url, method, content, name, proxied, type, ttl) {
            return fetch(url, {
                method,
                headers,
                body: JSON.stringify({
                    content,
                    name,
                    proxied,
                    type,
                    comment,
                    ttl
                })
            }).then(response => response.json())
        }

        logInfo(`New request from: \x1B[1m${requestURL.userAgent}\x1B[22m`)
        logInfo('Provided parameters:')
        console.log(JSON.stringify(requestURL, null, 2));

        // IPv4
        if (requestURL.ipv4.address) {
            logInfo(`IPv4 address provided in URL: \x1B[1m${requestURL.ipv4.address}\x1B[22m`)
            logInfo(`Searching for existing A record ID...`)

            const recordID = await getRecordID('A', requestURL.ipv4.name);

            // IPv4 record does already exist
            if (recordID) {
                logOk(`Found existing A record ID: \x1B[1m${recordID}\x1B[22m`)
                logInfo(`Updating existing A record to new IPv4 address: \x1B[1m${requestURL.ipv4.address}\x1B[22m`)

                // Update IPv4 record
                const response = await APIRequest(`${apiURL}/${recordID}`, 'PUT', requestURL.ipv4.address, requestURL.ipv4.name, requestURL.ipv4.proxied, 'A', requestURL.ipv4.ttl)
                // Error
                if (!response?.success) {
                    logFail(`Updating existing A record to new IPv4 address failed with the following response:`)
                    console.log(JSON.stringify(response, null, 2));
                    return new Response(JSON.stringify(response))
                } else {
                    logOk(`Existing A record was successfully updated to new IPv4 address: \x1B[1m${requestURL.ipv4.address}\x1B[22m`)
                }
            // IPv4 record does not exist
            } else {
                logInfo('Found no A record ID');
                logInfo(`Creating new A record with IPv4 address: \x1B[1m${requestURL.ipv4.address}\x1B[22m`);
                // Add IPv4 record
                const response = await APIRequest(apiURL, 'POST', requestURL.ipv4.address, requestURL.ipv4.name, requestURL.ipv4.proxied, 'A', requestURL.ipv4.ttl)
                // Error occurred
                if (!response?.success) {
                    logFail(`Creating new A record with IPv4 address failed with the following response:`)
                    console.log(JSON.stringify(response, null, 2));
                    return new Response(JSON.stringify(response))
                } else {
                    logOk(`New A record was successfully created: \x1B[1m${requestURL.ipv4.address}\x1B[22m`)
                }
            }
        }
        // IPv6
        if (requestURL.ipv6.address) {
            logInfo(`IPv6 address provided in URL: \x1B[1m${requestURL.ipv6.address}\x1B[22m`)
            logInfo(`Searching for existing AAAA record ID...`)

            const recordID = await getRecordID('AAAA', requestURL.ipv6.name);

            // IPv6 record does already exist
            if (recordID) {
                logOk(`Found existing AAAA record ID: \x1B[1m${recordID}\x1B[22m`)
                logInfo(`Updating existing AAAA record to new IPv4 address: \x1B[1m${requestURL.ipv6.address}\x1B[22m`)

                // Update IPv6 record
                const response = await APIRequest(`${apiURL}/${recordID}`, 'PUT', requestURL.ipv6.address, requestURL.ipv6.name, requestURL.ipv6.proxied, 'AAAA', requestURL.ipv6.ttl)
                // Error occurred
                if (!response?.success) {
                    logFail(`Creating new AAAA record with IPv6 address failed with the following response:`)
                    console.log(JSON.stringify(response, null, 2));
                    return new Response(JSON.stringify(response))
                } else {
                    logOk(`Existing AAAA record was successfully updated to new IPv6 address: \x1B[1m${requestURL.ipv6.address}\x1B[22m`)
                }
            // IPv6 record does not exist
            } else {
                logInfo('Found no AAAA record ID');
                logInfo(`Creating new AAAA record with IPv6 address: \x1B[1m${requestURL.ipv6.address}\x1B[22m`);

                // Add IPv6 record
                const response = await APIRequest(apiURL, 'POST', requestURL.ipv6.address, requestURL.ipv6.name, requestURL.ipv6.proxied, 'AAAA', requestURL.ipv6.ttl)
                // Error occurred
                if (!response?.success) {
                    logFail(`Creating new AAAA record with IPv6 address failed with the following response:`)
                    console.log(JSON.stringify(response, null, 2));
                    return new Response(JSON.stringify(response))
                } else {
                    logOk(`New AAAA record was successfully created: \x1B[1m${requestURL.ipv6.address}\x1B[22m`)
                }
            }
        }
        // Update successfull
        logOk('Update was successfull')
        return new Response(JSON.stringify(requestURL, null, 4))
    }
}
