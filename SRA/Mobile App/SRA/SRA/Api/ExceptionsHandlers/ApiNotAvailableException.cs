namespace SRA.Api.ExceptionsHandlers
{
    public class ApiNotAvailableException : System.Exception
    {
        public ApiNotAvailableException(string message) : base(message) { }
        public ApiNotAvailableException(string message, System.Exception inner) : base(message, inner) { }
    }
}