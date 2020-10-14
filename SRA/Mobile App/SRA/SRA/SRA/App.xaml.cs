using System;
using SRA.Api;
using SRA.Model;
using SRA.Utils;
using SRA.View;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

[assembly: XamlCompilation(XamlCompilationOptions.Compile)]

namespace SRA
{
    public partial class App : Application
    {
        private WebApi WebApi { set => Properties[Constants.WebApiProperty] = value; }
        public App()
        {
            WebApi = new WebApi();
            InitializeComponent();
            MainPage = new NavigationPage(new View.Login());
        }

        protected override void OnStart()
        {
            // Handle when your app starts
        }

        protected override void OnSleep()
        {
            // Handle when your app sleeps
        }

        protected override void OnResume()
        {
            // Handle when your app resumes
        }
    }
}