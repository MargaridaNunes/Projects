using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SRA.Resx;
using Xamarin.Essentials;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace SRA.View
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class StudentHomePage : TabbedPage
    {
        public StudentHomePage(int studentNumber)
        {
            NavigationPage.SetHasNavigationBar(this, false);
            var attendanceRegistryPage = new NavigationPage(new StudentAttendanceRegistry(studentNumber))
            {
                Title = AppResources.AttendanceRegistryTitle,
                IconImageSource = "scan.png"
            };
            var attendanceHistoryPage = new NavigationPage(new StudentAttendanceHistory(studentNumber))
            {
                Title = AppResources.AttendanceHistoryTitle,
                IconImageSource = "student.png"
            };
            Children.Add(attendanceRegistryPage);
            Children.Add(attendanceHistoryPage);
            InitializeComponent();
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