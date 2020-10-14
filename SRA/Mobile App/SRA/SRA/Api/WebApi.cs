using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using SRA.Api.ExceptionsHandlers;
using SRA.Api.HttpClientMethods;
using SRA.Dto;
using SRA.Model;
using SRA.Model.Users;
using SRA.Resx;
using SRA.Utils;

namespace SRA.Api
{
    public class WebApi
    {
        private readonly HttpClient _client = new HttpClient();

        /*
         * Contract that defines the JSON body of a request.
         * Eg. { studentName: 1 }
         */
        private readonly DefaultContractResolver _contractResolver = new DefaultContractResolver
        {
            NamingStrategy = new CamelCaseNamingStrategy()
        };

        /// <summary>
        /// Method responsible for make a get request to the api to get the attendance registration for a student.
        /// </summary>
        /// <param name="page">page number to be loaded</param>
        /// <param name="courseName"> the student lectures will be filtered by this course name</param>
        /// <param name="studentNumber"> student number </param>
        /// <returns> response for the request </returns>
        /// 
        /// <exception cref="ApiNotAvailableException"> if the operation was canceled because api wasn't available </exception>
        /// <exception cref="NoSuccessfulResponseException"> if the request was not successful </exception>
        public async Task<List<StudentLecture>> GetStudentLectures(int page, string courseName, int studentNumber)
        {
            try
            {
                var cancellationTokenSource = new CancellationTokenSource(Constants.Timeout);
                var uri = Links.StudentLecturesUri(page, courseName, studentNumber);
                var header = Convert.ToBase64String(Encoding.ASCII.GetBytes(await Authentication.Authentication.GetStoreCredentials()));
                var response = await _client.GetAsync(uri, cancellationTokenSource.Token, header);
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                var studentLecturesDto = JsonConvert.DeserializeObject<StudentLecturesDto>(content);
                return studentLecturesDto.Lectures;
            }
            catch (OperationCanceledException operationCanceledException)
            {
                throw new ApiNotAvailableException(AppResources.AttendanceHistoryMessage, operationCanceledException);
            }
            catch (HttpRequestException httpRequestException)
            {
                throw new NoSuccessfulResponseException(AppResources.AttendanceHistoryMessage, httpRequestException);
            }
        }

        /// <summary>
        /// Method responsible for make a put request to the api to registry a attendance of a student.
        /// </summary>
        /// 
        /// <param name="lectureId"> lecture id </param>
        /// <param name="studentNumber"> student number </param>
        /// 
        /// <returns> response for the request </returns>
        /// 
        /// <exception cref="ApiNotAvailableException"> if the operation was canceled because api wasn't available </exception>
        /// <exception cref="NoSuccessfulResponseException"> if the request was not successful </exception>
        public async Task<MessageResponse> RegistryStudentAttendance(int lectureId, int studentNumber)
        {
            try
            {
                StudentDto studentDto = new StudentDto {StudentNumber = studentNumber};
                var json = JsonConvert.SerializeObject(studentDto, Formatting.Indented,
                    new JsonSerializerSettings {ContractResolver = _contractResolver});
                var requestContent = new StringContent(json, Encoding.UTF8, "application/json");
                var cancellationTokenSource = new CancellationTokenSource(Constants.Timeout);
                var header = Convert.ToBase64String(Encoding.ASCII.GetBytes(await Authentication.Authentication.GetStoreCredentials()));
                var response = await _client.PutAsync(Links.RegistryAttendanceUri(lectureId),
                    requestContent, cancellationTokenSource.Token, header);
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<MessageResponse>(content);
            }
            catch (OperationCanceledException operationCanceledException)
            {
                throw new ApiNotAvailableException(AppResources.AttendanceNotRegisteredMessage,
                    operationCanceledException);
            }
            catch (HttpRequestException httpRequestException)
            {
                throw new NoSuccessfulResponseException(AppResources.AttendanceNotRegisteredMessage,
                    httpRequestException);
            }
        }

        /// <summary>
        /// Method responsible for make a get request to the api to get the collections with a specific state.
        /// </summary>
        /// <param name="page"> page number to be loaded</param>
        /// <param name="collectorId"> collector id that allows to obtain just the collections assign to this collector</param>
        /// <param name="collectionState"> collection state (eg. In Progress, Not started, ...) </param>
        /// 
        /// <returns> response for the request </returns>
        /// <exception cref="ApiNotAvailableException"> if the operation was canceled because api wasn't available </exception>
        /// <exception cref="NoSuccessfulResponseException"> if the request was not successful </exception>
        public async Task<List<CollectionLecture>> GetCollections(int page, int collectorId, string collectionState)
        {
            try
            {
                var cancellationTokenSource = new CancellationTokenSource(Constants.Timeout);
                var header = Convert.ToBase64String(Encoding.ASCII.GetBytes(await Authentication.Authentication.GetStoreCredentials()));
                var response = await _client.GetAsync(Links.GetCollectionsUri(page, collectorId, collectionState), cancellationTokenSource.Token, header);
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                var collectionLectureDto = JsonConvert.DeserializeObject<CollectionLecturesDto>(content);
                return collectionLectureDto.Collections;
            }
            catch (OperationCanceledException operationCanceledException)
            {
                throw new ApiNotAvailableException(AppResources.CollectionMessage, operationCanceledException);
            }
            catch (HttpRequestException httpRequestException)
            {
                throw new NoSuccessfulResponseException(AppResources.CollectionMessage, httpRequestException);
            }
        }

        /// <summary>
        /// Method responsible for make a patch request to the api to update the collection state.
        ///</summary>
        ///
        /// <param name="lectureId"> lecture id </param>
        /// <param name="collectionState"> collection state (eg. In Progress, Not started, ...) </param>
        /// <param name="notes"> collection note made by the collection responsible </param>
        ///
        /// <exception cref="ApiNotAvailableException"> if the operation was canceled because api wasn't available </exception>
        /// <exception cref="NoSuccessfulResponseException"> if the request was not successful </exception>
        public async Task UpdateCollectionSate(int lectureId, string collectionState, string notes)
        {
            try
            {
                string json;
                if (notes == null)
                {
                    var stateDto = new StateDto {State = collectionState};
                    json = JsonConvert.SerializeObject(stateDto, Formatting.Indented,
                        new JsonSerializerSettings {ContractResolver = _contractResolver});
                }
                else
                {
                    var collectionDto = new CollectionDto {Notes = notes, State = collectionState};
                    json = JsonConvert.SerializeObject(collectionDto, Formatting.Indented,
                        new JsonSerializerSettings {ContractResolver = _contractResolver});
                }
                var requestContent = new StringContent(json, Encoding.UTF8, "application/json");
                var cancellationTokenSource = new CancellationTokenSource(Constants.Timeout);
                var header = Convert.ToBase64String(Encoding.ASCII.GetBytes(await Authentication.Authentication.GetStoreCredentials()));
                var response = await _client.PatchAsync(Links.UpdateCollectionUri(lectureId), requestContent, cancellationTokenSource.Token, header);
                response.EnsureSuccessStatusCode();
            }
            catch (OperationCanceledException operationCanceledException)
            {
                throw new ApiNotAvailableException(Constants.ApiNotAvailableMessage, operationCanceledException);
            }
            catch (HttpRequestException httpRequestException)
            {
                throw new NoSuccessfulResponseException(Constants.StateChangeMessage, httpRequestException);
            }
        }

        /// <summary>
        /// Method responsible for send the user credentials to api for validation and check the user role in the system.
        /// </summary>
        /// 
        /// <param name="email"> user email to login in the system</param>
        /// <param name="password"> user password to login in the system</param>
        /// 
        /// <returns>An object with the user roles in the system</returns>
        /// <exception cref="ApiNotAvailableException"></exception>
        /// <exception cref="NoSuccessfulResponseException"></exception>
        public async Task<Users> Login(string email, string password)
        {
            try
            {
                var loginInfo = new LoginInfoDto {Email = email, Password = password};
                string json = JsonConvert.SerializeObject(loginInfo, Formatting.Indented,
                    new JsonSerializerSettings {ContractResolver = _contractResolver});
                var requestContent = new StringContent(json, Encoding.UTF8, "application/json");
                var cancellationTokenSource = new CancellationTokenSource(Constants.Timeout);
                var response = await _client.PostAsync(Links.LoginUri, requestContent, cancellationTokenSource.Token);
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<Users>(content);
            }
            catch (OperationCanceledException operationCanceledException)
            {
                throw new ApiNotAvailableException(AppResources.OperationNotPossibleMessage, operationCanceledException);
            }
            catch (HttpRequestException httpRequestException)
            {
                throw new NoSuccessfulResponseException(AppResources.LoginErrorMessage, httpRequestException);
            }
        }
    }
}