using System;
using System.Windows.Input;
using SRA.Api;
using SRA.Api.ExceptionsHandlers;
using SRA.Resx;
using SRA.Utils;
using Xamarin.Forms;
using ZXing;

namespace SRA.ViewModel
{
    /// <summary>
    /// View model that permits the scan of qr code with Zxing library
    /// </summary>
    public class ScanPageViewModel : NotifyPropertyChangedViewModel
    {
        private IPageService _pageService;
        private WebApi api = (WebApi) Application.Current.Properties[Constants.WebApiProperty];
        
        private int StudentNumber { get; set; }

        private bool _isAnalyzing = true;
        public bool IsAnalyzing
        {
            get => _isAnalyzing;
            set => SetValue(ref _isAnalyzing, value);
        }
        
        public Result Result { get; set; }
        public ICommand ScanCommand { get; set; }

        public ScanPageViewModel(IPageService pageService, int studentNumber)
        {
            StudentNumber = studentNumber;
            _pageService = pageService;
            ScanCommand = new Command(async () =>
            {
                Device.BeginInvokeOnMainThread(() =>
                {
                    IsAnalyzing = false;
                });
                try
                {
                    await api.RegistryStudentAttendance(int.Parse(Result.Text), StudentNumber);
                    Device.BeginInvokeOnMainThread(async () =>
                    {
                        await _pageService.DisplayAlert( AppResources.AttendanceRegisteredMessage, "", AppResources.OkMessage);
                        await _pageService.PopAsync();
                    });
                }
                catch (Exception e)
                {
                    if (e is NoSuccessfulResponseException || e is ApiNotAvailableException)
                    {
                        Device.BeginInvokeOnMainThread(async () => await _pageService.DisplayAlert(e.Message, AppResources.TryAgainMessage, AppResources.OkMessage));
                    }
                }

            });
        }
    }
}