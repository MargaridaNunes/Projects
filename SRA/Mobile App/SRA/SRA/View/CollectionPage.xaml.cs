using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SRA.Model;
using SRA.Resx;
using SRA.Utils;
using SRA.ViewModel;
using Xamarin.Essentials;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace SRA.View
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class CollectionPage : ContentPage
    {
        public CollectionPageViewModel ViewModel
        {
            get => BindingContext as CollectionPageViewModel;
            set => BindingContext = value;
        }
        
        public CollectionPage(CollectionLecture collectionLecture, int collectorId)
        {
            InitializeComponent();
            if(!SRA.Login.Login.HasMoreThanOneRole) ToolbarItems.RemoveAt(0);
            ViewModel = new CollectionPageViewModel(collectionLecture, collectorId, new PageService());
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            QrCodeImage.Source = ViewModel.ImageSource;
            Connectivity.ConnectivityChanged += ConnectivityChanged;
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
    }
}