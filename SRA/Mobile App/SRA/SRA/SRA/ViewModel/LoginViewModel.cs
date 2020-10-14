using System;
using System.Text;
using System.Windows.Input;
using SRA.Resx;
using SRA.Utils;
using Xamarin.Forms;

namespace SRA.ViewModel
{
    public class LoginViewModel
    {
        private IPageService _pageService;
        private string _email;
        private string _password;
        
        public ICommand LoginCommand { get; set; }
        public ICommand EmailCommand { get; set; }
        public ICommand PasswordCommand { get; set; }

        public LoginViewModel(IPageService pageService)
        {
            _pageService = pageService;
            LoginCommand = new Command(Login);
            EmailCommand = new Command<string>(email => _email = email);
            PasswordCommand = new Command<string>(password => _password = Convert.ToBase64String(Encoding.ASCII.GetBytes(password)));
        }

        /// <summary>
        /// Check if there are credentials to login
        /// </summary>
        private async void Login()
        {
            if (string.IsNullOrEmpty(_email) || string.IsNullOrEmpty(_password))
            {
                await _pageService.DisplayAlert(AppResources.StudentNumberFieldEmpty, "", AppResources.OkMessage);
                return;
            }
            SRA.Login.Login.DoLogin(_email, _password);
        }
    }
}