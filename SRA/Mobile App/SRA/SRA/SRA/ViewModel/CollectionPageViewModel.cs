using System;
using System.Drawing;
using System.IO;
using System.Windows.Input;
using QRCoder;
using SRA.Api;
using SRA.Api.ExceptionsHandlers;
using SRA.Model;
using SRA.Resx;
using SRA.Utils;
using SRA.View;
using Xamarin.Forms;

namespace SRA.ViewModel
{
    public class CollectionPageViewModel : NotifyPropertyChangedViewModel
    {
        private IPageService _pageService;
        private WebApi api = (WebApi) Application.Current.Properties[Constants.WebApiProperty];
        private CollectionLecture CollectionLecture { get; set; }
        private int CollectorId { get; set; }
        private ImageSource _imageSource;
        public ImageSource ImageSource
        {
            get => _imageSource;
            set => SetValue(ref _imageSource, value);
        }
        public ICommand RegistryAttendanceCommand { get; set; }
        public ICommand RolesCommand { get; set; }
        public ICommand FinishCollectionCommand { get; set; }
        
        public CollectionPageViewModel(CollectionLecture collectionLecture, int collectorId, PageService pageService)
        {
            _pageService = pageService;
            CollectionLecture = collectionLecture;
            CollectorId = collectorId;
            GenerateQRCode();
            RegistryAttendanceCommand = new Command<string>(RegistryStudentAttendance);
            FinishCollectionCommand = new Command<string>(FinishCollection);
            RolesCommand = new Command(async () => await _pageService.PushAsync(new RolesPage()));
        }
        
        /// <summary>
        /// Generates the qr code with the lectureId
        /// </summary>
        private void GenerateQRCode()
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(CollectionLecture.LectureId.ToString(), QRCodeGenerator.ECCLevel.Q);
            PngByteQRCode qRCode = new PngByteQRCode(qrCodeData);
            byte [] code = qRCode.GetGraphic(20);
            ImageSource = ImageSource.FromStream(() => new MemoryStream(code));
        }
        
        /// <summary>
        /// Registry the student attendance based on the student number received
        /// </summary>
        /// <param name="entryText">student number inserted in entry</param>
        private async void RegistryStudentAttendance(string entryText)
        {
            if (entryText.Length == 0)
            {
                await _pageService.DisplayAlert(AppResources.StudentNumberFieldEmpty,"", AppResources.OkMessage);
                return;
            }
            try
            {
                var studentNumber = int.Parse(entryText);
                var message = await api.RegistryStudentAttendance(CollectionLecture.LectureId, studentNumber);
                await _pageService.DisplayAlert(message.Message, AppResources.AttendanceRegisteredMessage, AppResources.OkMessage);
            }
            catch (Exception e)
            {
                if (e is NoSuccessfulResponseException || e is ApiNotAvailableException)
                {
                    await _pageService.DisplayAlert(e.Message, AppResources.TryAgainMessage, AppResources.OkMessage);
                }
            }
        }

        /// <summary>
        /// Finish the collection by update the collection state to FINISHED
        /// </summary>
        /// <param name="editorText"></param>
        private async void FinishCollection(string editorText)
        {
            var answer = await _pageService.DisplayAlert(AppResources.FinishCollectionMessage, "", AppResources.YesMessage, AppResources.NoMessage);
            if (!answer) return;
            try
            {
                await api.UpdateCollectionSate(CollectionLecture.LectureId, Constants.FinishedCollectionState, editorText);
                await _pageService.PushAsync(new CollectorHomePage(CollectorId));
            }
            catch (Exception e)
            {
                if (e is NoSuccessfulResponseException || e is ApiNotAvailableException)
                {
                    await _pageService.DisplayAlert(AppResources.FinishCollectionErrorMessage, AppResources.TryAgainMessage, AppResources.OkMessage);
                }
            }
        }
        
    }
}