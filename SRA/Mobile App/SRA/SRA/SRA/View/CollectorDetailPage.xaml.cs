
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
    public partial class CollectorDetailPage : ContentPage
    {
        public CollectorDetailPageViewModel ViewModel
        {
            get => BindingContext as CollectorDetailPageViewModel;
            set => BindingContext = value;
        }
        
        public CollectorDetailPage(CollectionLecture collectionLecture, int collectorId)
        {
            InitializeComponent();
            if(!SRA.Login.Login.HasMoreThanOneRole) ToolbarItems.RemoveAt(0);
            ViewModel = new CollectorDetailPageViewModel(collectionLecture, collectorId, new PageService());
        }
        
        protected override void OnAppearing()
        {
            base.OnAppearing();
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