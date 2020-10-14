using System;
using System.Drawing;
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
    public class CollectorDetailPageViewModel
    {
        private readonly IPageService _pageService;
        private WebApi api = (WebApi) Application.Current.Properties[Constants.WebApiProperty];
        
        private int CollectorId { get; set; }
        public CollectionLecture CollectionLecture { get; set; }
        public ICommand RolesCommand { get; set; }
        public ICommand StartCollectionCommand { get; set; }

        public CollectorDetailPageViewModel(CollectionLecture collectionLecture, int collectorId, PageService pageService)
        {
            CollectionLecture = collectionLecture;
            CollectorId = collectorId;
            _pageService = pageService;
            StartCollectionCommand = new Command(StartCollection);
            RolesCommand = new Command(async () => await _pageService.PushAsync(new RolesPage()));
        }

        /// <summary>
        /// Start the collection by update the collection state to IN PROGRESS
        /// </summary>
        private async void StartCollection()
        {
            try
            {
                await api.UpdateCollectionSate(CollectionLecture.LectureId, Constants.InProgressCollectionState, null);
            }
            catch (Exception e)
            {
                if (e is NoSuccessfulResponseException || e is ApiNotAvailableException)
                {
                    await _pageService.DisplayAlert(AppResources.StartCollectionErrorMessage, AppResources.TryAgainMessage, AppResources.OkMessage);
                    return;
                }
            }
            await _pageService.DisplayAlert(AppResources.StartCollectionMessage, $"{AppResources.CollectionStateMessage} {Constants.InProgressCollectionState}", AppResources.OkMessage);
            await _pageService.PushAsync(new CollectionPage(CollectionLecture, CollectorId));
        }
    }
}