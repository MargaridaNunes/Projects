namespace SRA.Utils
{
    /// <summary>
    /// Class with constants that are used in the application
    /// </summary>
    public static class Constants
    {
        public const string WebApiProperty = "WebApi";

        public const string Token = "token";

        public const int Timeout = 10000;

        public const string ApiNotAvailableMessage = "The Api isn´t available at the moment";
        public const string StateChangeMessage = "Isn't possible to change the collection state";

        public const string NotStartedCollectionState = "NOT STARTED";
        public const string InProgressCollectionState = "IN PROGRESS";
        public const string FinishedCollectionState = "FINISHED";

        public const int PageSize = 40;
    }
}