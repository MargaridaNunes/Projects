using System;
using System.Collections.Generic;
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
    public partial class StudentDetailAttendanceHistory : ContentPage
    {
        public StudentDetailAttendanceHistoryViewModel ViewModel
        {
            get => BindingContext as StudentDetailAttendanceHistoryViewModel;
            set => BindingContext = value;
        }
        
        public StudentDetailAttendanceHistory(StudentLecture studentLecture)
        {
            InitializeComponent();
            if(!SRA.Login.Login.HasMoreThanOneRole) ToolbarItems.RemoveAt(0);
            ViewModel = new StudentDetailAttendanceHistoryViewModel(new PageService(), studentLecture);
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