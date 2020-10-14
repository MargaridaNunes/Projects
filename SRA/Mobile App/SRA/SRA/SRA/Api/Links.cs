
using System;
using SRA.ViewModel;
using Xamarin.Forms;

namespace SRA.Api
{
    /*
     * Class where are defined the URIs for api requests
     */
    public static class Links
    {
        /*
         * Applications running in the Android emulator can connect to local HTTP web services via the 10.0.2.2 address
         * which is an alias to your host loopback interface (127.0.0.1 on your development machine).
         * https://docs.microsoft.com/en-us/xamarin/cross-platform/deploy-test/connect-to-local-web-services
         */
        
        //To use when the api is running in the localhost and the app is running in emulator
        //private static readonly string BaseUri = Device.RuntimePlatform == Device.Android ? "http://10.0.2.2:8090/sra/api" : "http://localhost:8090/sra/api";

        //To use when when the api is running in vm
        private const string BaseUri = "http://10.62.73.49:8090/sra/api";
        
        public static Uri LoginUri = new Uri($"{BaseUri}/login");

        public static Uri StudentLecturesUri(int page, string courseName, int studentNumber)
        {
            return new Uri($"{BaseUri}/students/{studentNumber}/lectures?page={page}&course={courseName}");
        }

        public static Uri RegistryAttendanceUri(int lectureId)
        {
            return new Uri($"{BaseUri}/lectures/{lectureId}/collection/registry");
        }

        public static Uri GetCollectionsUri(int page, int collectorId, string collectionState)
        {
            return new Uri($"{BaseUri}/collections/{collectorId}?page={page}&state={collectionState}");
        }

        public static Uri UpdateCollectionUri(int lectureId)
        {
            return new Uri($"{BaseUri}/lectures/{lectureId}/collection");
        }
    }
}