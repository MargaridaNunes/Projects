﻿﻿using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

namespace SRA.Api
{
    public static class HttpClientPatchAsync
    {
        /// <summary>
        /// System.Net.HttpClient class has no support for PatchAsync method.
        /// Extension method for PatchAsync Request
        /// </summary>
        /// 
        /// <param name="client"> instance of System.Net.HttpClient </param>
        /// <param name="requestUri"> Uri for the request </param>
        /// <param name="content"> instance of System.Net.Http which is base class representing an HTTP entity body and content headers </param>
        /// <param name="cToken"> when the specified time in cancellation token is reached the cancellationToken is used to cancel the operation</param>
        /// <param name="authenticationHeader"> authentication header value</param>
        /// 
        /// <returns> response for the request </returns>
        public static async Task<HttpResponseMessage> PatchAsync(this HttpClient client, Uri requestUri, HttpContent content, CancellationToken cToken, string authenticationHeader)
        {
            var method = new HttpMethod("PATCH");
            var request = new HttpRequestMessage(method, requestUri)
            {
                Headers = { Authorization = new AuthenticationHeaderValue("Basic", authenticationHeader)},
                Content = content
            };
            var response = await client.SendAsync(request, cToken);
            return response;
        }
    }
}