using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SRA.Resx;
using SRA.Utils;
using SRA.ViewModel;
using Xamarin.Essentials;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace SRA.View
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Login : ContentPage
    {
        public LoginViewModel ViewModel
        {
            get => BindingContext as LoginViewModel;
            set => BindingContext = value;
        }
        public Login()
        {
            InitializeComponent();
            NavigationPage.SetHasBackButton(this, false);
            SRA.Login.Login.CheckIfIsAlreadyLogin();
            ViewModel = new LoginViewModel(new PageService());
            
        }

        
        
        protected override async void OnAppearing()
        {
            base.OnAppearing();
            Connectivity.ConnectivityChanged += ConnectivityChanged;
            if (Connectivity.NetworkAccess != NetworkAccess.Internet)
            {
                await DisplayAlert(AppResources.NoConnectivityMessage, AppResources.NoConnectivity, AppResources.OkMessage);
            }
        }

        private void ConnectivityChanged(object sender, ConnectivityChangedEventArgs e)
        {
            if (e.NetworkAccess != NetworkAccess.Internet)
            {
                DisplayAlert(AppResources.NoConnectivityMessage, AppResources.NoConnectivity, AppResources.OkMessage);
            }
        }

        protected override void OnDisappearing()
        {
            base.OnDisappearing();
            Connectivity.ConnectivityChanged -= ConnectivityChanged;
        }

        private void OnChangeEmail(object sender, TextChangedEventArgs e)
        {
            ViewModel.EmailCommand.Execute(e.NewTextValue);
        }

        private void OnChangePassword(object sender, TextChangedEventArgs e)
        {
            ViewModel.PasswordCommand.Execute(e.NewTextValue);
        }
    }
}