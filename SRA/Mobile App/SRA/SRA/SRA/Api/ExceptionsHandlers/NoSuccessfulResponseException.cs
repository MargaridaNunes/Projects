namespace SRA.Api.ExceptionsHandlers
{
    public class NoSuccessfulResponseException : System.Exception
    {
        public NoSuccessfulResponseException(string message) : base(message) { }
        public NoSuccessfulResponseException(string message, System.Exception inner) : base(message, inner) { }
    }
}