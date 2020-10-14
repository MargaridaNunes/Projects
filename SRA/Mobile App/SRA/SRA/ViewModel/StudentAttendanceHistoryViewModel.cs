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
using Xamarin.Forms;
using Xamarin.Forms.Extended;

namespace SRA.ViewModel
{
    public class StudentAttendanceHistoryViewModel : NotifyPropertyChangedViewModel
    {
        private readonly IPageService _pageService;
        private WebApi api = (WebApi) Application.Current.Properties[Constants.WebApiProperty];
        private InfiniteScrollCollection<StudentLecture> _studentLectures;
        private List<StudentLecture> _studentLecturesPageList;
        private StudentLecture _selectedRegistry;
        private bool _isRefreshing;
        private bool _imageVisibility;
        private bool _loadingItems;
        private int StudentNumber { get; set; }

        public bool LoadingItems
        {
            get => _loadingItems;
            set => SetValue(ref _loadingItems,value); 
        }
        public StudentLecture SelectedRegistry
        {
            get => _selectedRegistry;
            set => SetValue(ref _selectedRegistry, value);
        }
        public InfiniteScrollCollection<StudentLecture> StudentLectures
        {
            get => _studentLectures;
            set => SetValue(ref _studentLectures, value);
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

        public ICommand SelectRegistryCommand { get; set; }
        public ICommand RefreshCommand { get; set; }
        public ICommand SearchCommand { get; set; }
        public ICommand RolesCommand { get; set; }
        
        public StudentAttendanceHistoryViewModel(IPageService pageService, int studentNumber)
        {
            ImageVisibility = false;
            StudentNumber = studentNumber;
            _pageService = pageService;
            GetAttendanceRegistry("");
            SelectRegistryCommand = new Command<StudentLecture>(async sl => await SelectRegistry(sl));
            RefreshCommand = new Command(Refresh);
            SearchCommand = new Command<string>(SearchAttendance);
            RolesCommand = new Command(async () => await _pageService.PushAsync(new RolesPage()));
        }

        /// <summary>
        /// Get the attendances registries of the student with the StudentNumber
        /// </summary>
        /// <param name="courseName">search attendances registries based on courseName</param>
        private async void GetAttendanceRegistry(string courseName)
        {
            try
            {
                StudentLectures = new InfiniteScrollCollection<StudentLecture>
                {
                    OnLoadMore = async () =>
                    {
                        LoadingItems = true;
                        var nextPage = (StudentLectures.Count / Constants.PageSize) + 1;
                        _studentLecturesPageList = await api.GetStudentLectures(nextPage, courseName, StudentNumber);
                        LoadingItems = false;
                        return _studentLecturesPageList;
                    },
                    OnCanLoadMore = () => _studentLecturesPageList.Count == Constants.PageSize
                };
                await StudentLectures.LoadMoreAsync();
                ImageVisibility = StudentLectures.Count == 0;
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
        /// When selected a list entry goes to the details screen
        /// </summary>
        /// <param name="studentLecture">attendance registration information</param>
        /// <returns></returns>
        private async Task SelectRegistry(StudentLecture studentLecture)
        {
            if(studentLecture == null) return;
            SelectedRegistry = null;
            await _pageService.PushAsync(new StudentDetailAttendanceHistory(studentLecture));
        }

        /// <summary>
        /// Updates the Attendance list when refresh
        /// </summary>
        private void Refresh()
        {
            IsRefreshing = true;
            GetAttendanceRegistry("");
            IsRefreshing = false;
        }
        
        /// <summary>
        /// Get the attendances registries based on the course name 
        /// </summary>
        /// <param name="text">course name</param>
        private void SearchAttendance(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return;
            GetAttendanceRegistry(text);
        }
    }
}