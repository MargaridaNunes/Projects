using SRA.Resx;
using SRA.Utils;
using SRA.ViewModel;
using Xamarin.Essentials;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace SRA.View
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class CollectorHomePage : TabbedPage
    {
        
        public CollectorHomePage(int collectorId)
        {
            NavigationPage.SetHasNavigationBar(this, false);
            var attendanceRegistryPage = new NavigationPage(new CollectorStateCollections(collectorId, Constants.NotStartedCollectionState))
            {
                Title = AppResources.NotStartedStateCollection,
                IconImageSource = "NotStarted.png"
            };
            var attendanceHistoryPage = new NavigationPage(new CollectorStateCollections(collectorId, Constants.InProgressCollectionState))
            {
                Title = AppResources.InProgressStateCollection,
                IconImageSource = "InProgress.png"
            };
            Children.Add(attendanceRegistryPage);
            Children.Add(attendanceHistoryPage);
            InitializeComponent();
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