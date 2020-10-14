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
    public partial class ScanPage : ContentPage
    {
        public ScanPageViewModel ViewModel
        {
            get => BindingContext as ScanPageViewModel;
            set => BindingContext = value;
        }
        
        public ScanPage(int studentNumber)
        {
            InitializeComponent();
            ViewModel = new ScanPageViewModel(new PageService(), studentNumber);
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            ZxingScannerView.IsScanning = true;
            Connectivity.ConnectivityChanged += ConnectivityChanged;
        }
        
        protected override void OnDisappearing()
        {
            ZxingScannerView.IsScanning = false;
            Connectivity.ConnectivityChanged -= ConnectivityChanged;
            base.OnDisappearing();
        }
        
        private void ConnectivityChanged(object sender, ConnectivityChangedEventArgs e)
        {
            if (e.NetworkAccess != NetworkAccess.Internet)
            {
                DisplayAlert(AppResources.NoConnectivityMessage, AppResources.NoConnectivity, AppResources.OkMessage);
            }
        }
    }
}