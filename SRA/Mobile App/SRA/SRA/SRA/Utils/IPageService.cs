using System.ComponentModel;
using System.Threading.Tasks;
using Xamarin.Forms;

namespace SRA.Utils
{
    public interface IPageService
    {
        Task PushAsync(Page page);
        Task PopAsync();
        Task DisplayAlert(string title, string message, string ok);
        Task<bool> DisplayAlert(string title, string message, string ok, string cancel);
    }
}