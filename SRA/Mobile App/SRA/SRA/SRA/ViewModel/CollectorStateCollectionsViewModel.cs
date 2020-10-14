using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Windows.Input;
using SRA.Api;
using SRA.Api.ExceptionsHandlers;
using SRA.Model;
using SRA.Resx;
using SRA.Utils;
using SRA.View;
using Xamarin.Essentials;
using Xamarin.Forms;
using Xamarin.Forms.Extended;

namespace SRA.ViewModel
{
    public class CollectorStateCollectionsViewModel : NotifyPropertyChangedViewModel
    {
        private IPageService _pageService;
        private WebApi api = (WebApi) Application.Current.Properties[Constants.WebApiProperty];
        private InfiniteScrollCollection<CollectionLecture> _collections = new InfiniteScrollCollection<CollectionLecture>();
        private List<CollectionLecture> _collectionsPageList;
        private CollectionLecture _selectedCollection;
        private readonly string _collectionState;
        private string _collectionEmptyListMessage;
        private bool _loadingItems;
        private bool _isRefreshing;
        private bool _imageVisibility;

        private int CollectorId { get; set; }

        public InfiniteScrollCollection<CollectionLecture> Collections
        {
            get => _collections;
            set => SetValue(ref _collections, value);
        }

        public CollectionLecture SelectedCollection
        {
            get => _selectedCollection;
            set => SetValue(ref _selectedCollection, value);
        }
        public string CollectionEmptyListMessage
        {
            get => _collectionEmptyListMessage;
            set => SetValue(ref _collectionEmptyListMessage, value); }
        public bool LoadingItems
        {
            get => _loadingItems;
            set => SetValue(ref _loadingItems, value);
        }
        
        public bool IsRefreshing
        {
            get => _isRefreshing;
            set => SetValue(ref _isRefreshing, value);
        }
        
        public bool ImageVisibility
        {
            get => _imageVisibility;
            set => SetValue(ref _imageVisibility, value);
        }
        
        public ICommand SelectedCollectionCommand { get; set; }
        public ICommand RefreshCommand { get; set; }
        public ICommand RolesCommand { get; set; }
        public ICommand LogoutCommand { get; set; }

        public CollectorStateCollectionsViewModel(int collectorId, string collectionState, IPageService pageService)
        {
            _pageService = pageService;
            CollectorId = collectorId;
            _collectionState = collectionState;
            GetCollections();
            SelectedCollectionCommand = new Command<CollectionLecture>(async cl => await CheckStateCollection(cl));
            RefreshCommand = new Command(Refresh);
            RolesCommand = new Command(async () => await _pageService.PushAsync(new RolesPage()));
            LogoutCommand = new Command(async () =>
            {
                Authentication.Authentication.RemoveCredentials();
                await _pageService.PushAsync(new View.Login());
            });
        }

        /// <summary>
        /// Get collections based on the state
        /// </summary>
        private async void GetCollections()
        {
            try
            {
                Collections = new InfiniteScrollCollection<CollectionLecture>
                {
                    OnLoadMore = async () =>
                    {
                        LoadingItems = true;
                        var nextPage = (Collections.Count / Constants.PageSize) + 1;
                        _collectionsPageList = await api.GetCollections(nextPage, CollectorId, _collectionState);
                        LoadingItems = false;
                        return _collectionsPageList;
                    },
                    OnCanLoadMore = () => _collectionsPageList.Count == Constants.PageSize
                };
                await Collections.LoadMoreAsync();
                if (Collections.Count == 0)
                {
                    ImageVisibility = true;
                    CollectionEmptyListMessage = _collectionState.Equals(Constants.NotStartedCollectionState)
                        ? AppResources.CollectionEmptyListMessage
                        : AppResources.CollectionInProgressEmptyListMessage;
                }
                else ImageVisibility = false;
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
        /// Based on the collection state go to a specific screen
        /// </summary>
        /// <param name="collectionLecture">collection information</param>
        /// <returns></returns>
        private async Task CheckStateCollection(CollectionLecture collectionLecture)
        {
            if (collectionLecture == null) return;
            SelectedCollection = null;
            if (_collectionState.Equals(Constants.NotStartedCollectionState)) await _pageService.PushAsync(new CollectorDetailPage(collectionLecture, CollectorId));
            else await _pageService.PushAsync(new CollectionPage(collectionLecture, CollectorId));
        }

        /// <summary>
        /// Update the collections list when refresh
        /// </summary>
        private void Refresh()
        {
            IsRefreshing = true;
            GetCollections();
            IsRefreshing = false;
        }
    }
}