using System;
using System.Windows.Input;
using SRA.Api;
using SRA.Api.ExceptionsHandlers;
using SRA.Resx;
using SRA.Utils;
using SRA.View;
using Xamarin.Essentials;
using Xamarin.Forms;
using ZXing;

namespace SRA.ViewModel
{
    public class StudentAttendanceRegistryViewModel : NotifyPropertyChangedViewModel
    {
        private IPageService _pageService;
        private bool _scanButtonEnable;

        public bool ScanButtonEnable
        {
            get => _scanButtonEnable;
            set => SetValue(ref _scanButtonEnable, value);
        }
        public ICommand ScanCommand { get; set; }
        public ICommand LogoutCommand { get; set; }
        public ICommand RolesCommand { get; set; }
        
        public StudentAttendanceRegistryViewModel(PageService pageService, int studentNumber)
        {
            _pageService = pageService;
            ScanButtonEnable = true;
            ScanCommand = new Command(() => _pageService.PushAsync(new ScanPage(studentNumber)));
            RolesCommand = new Command(async () =>
            {
                ScanButtonEnable = false;
                await _pageService.PushAsync(new RolesPage());
            });
            LogoutCommand = new Command(async () =>
            { 
                Authentication.Authentication.RemoveCredentials();
                await _pageService.PushAsync(new View.Login());
            });
        }
    }
}