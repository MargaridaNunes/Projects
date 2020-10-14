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
    public partial class StudentAttendanceRegistry : ContentPage
    {
        public StudentAttendanceRegistryViewModel ViewModel
        {
            get => BindingContext as StudentAttendanceRegistryViewModel;
            set => BindingContext = value;
        }

        public StudentAttendanceRegistry(int studentNumber)
        {
            InitializeComponent();
            NavigationPage.SetHasBackButton(this, false);
            if(!SRA.Login.Login.HasMoreThanOneRole) ToolbarItems.RemoveAt(0);
            ViewModel = new StudentAttendanceRegistryViewModel(new PageService(), studentNumber);
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            Connectivity.ConnectivityChanged += ConnectivityChanged;
        }

        protected override void OnDisappearing()
        {
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