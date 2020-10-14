
using SRA.Resx;
using SRA.Utils;
using SRA.ViewModel;
using Xamarin.Essentials;
using Xamarin.Forms;

namespace SRA.View
{
    public partial class StudentAttendanceHistory : ContentPage
    {
        public StudentAttendanceHistoryViewModel ViewModel
        {
            get => BindingContext as StudentAttendanceHistoryViewModel;
            set => BindingContext = value;
        }
        
        public StudentAttendanceHistory(int studentNumber)
        {
            InitializeComponent();
            NavigationPage.SetHasBackButton(this, false);
            if(!SRA.Login.Login.HasMoreThanOneRole) ToolbarItems.RemoveAt(0);
            ViewModel = new StudentAttendanceHistoryViewModel(new PageService(), studentNumber);
        }

        private void Registry_OnItemSelected(object sender, SelectedItemChangedEventArgs e)
        {
            ViewModel.SelectRegistryCommand.Execute(e.SelectedItem);
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