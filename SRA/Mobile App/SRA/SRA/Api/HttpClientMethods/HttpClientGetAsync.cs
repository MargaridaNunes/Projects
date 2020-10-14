﻿using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

namespace SRA.Api.HttpClientMethods
{
    public static class HttpClientGetAsync
    {
        /// <summary>
        /// Extension method for GetAsync Request with headers
        /// </summary>
        /// 
        /// <param name="client"> instance of System.Net.HttpClient </param>
        /// <param name="requestUri"> Uri for the request </param>
        /// <param name="cToken"> when the specified time in cancellation token is reached the cancellationToken is used to cancel the operation</param>
        /// <param name="authenticationHeader"> authentication header value</param>
        /// 
        /// <returns> response for the request </returns>
        public static async Task<HttpResponseMessage> GetAsync(this HttpClient client, Uri requestUri, CancellationToken cToken, string authenticationHeader)
        {
            var method = new HttpMethod("GET");
            var request = new HttpRequestMessage(method, requestUri)
            {
                Headers = { Authorization = new AuthenticationHeaderValue("Basic", authenticationHeader)},
            };
            var response = await client.SendAsync(request, cToken);
            return response;
        }
    }
}