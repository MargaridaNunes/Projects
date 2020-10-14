
using SRA.Resx;
using SRA.Utils;
using SRA.ViewModel;
using Xamarin.Essentials;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace SRA.View
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class CollectorStateCollections : ContentPage
    {
        public CollectorStateCollectionsViewModel ViewModel
        {
            get => BindingContext as CollectorStateCollectionsViewModel;
            set => BindingContext = value;
        }
    
        public CollectorStateCollections(int collectorId, string collectionState)
        {
            InitializeComponent();
            NavigationPage.SetHasBackButton(this, false);
            if(!SRA.Login.Login.HasMoreThanOneRole) ToolbarItems.RemoveAt(0);
            ViewModel = new CollectorStateCollectionsViewModel(collectorId, collectionState, new PageService());
        }
        
        private void Collection_OnItemSelected(object sender, SelectedItemChangedEventArgs e)
        {
            ViewModel.SelectedCollectionCommand.Execute(e.SelectedItem);
        }
        
        protected override void OnAppearing()
        {
            base.OnAppearing();
            Connectivity.ConnectivityChanged += ConnectivityChanged;
            if (Connectivity.NetworkAccess != NetworkAccess.Internet)
            {
                DisplayAlert(AppResources.NoConnectivityMessage, AppResources.NoConnectivity, AppResources.OkMessage);
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
    }
}