using System;
using System.Windows.Input;
using SRA.Utils;
using SRA.View;
using Xamarin.Essentials;
using Xamarin.Forms;

namespace SRA.ViewModel
{
    /// <summary>
    /// View model that redirects user to student view or collector view  
    /// </summary>
    public class RolesPageViewModel
    {
        private IPageService _pageService;
        
        public int StudentNumber { get; set; }
        public int CollectorId { get; set; }

        public ICommand StudentPageCommand { get; set; }
        public ICommand CollectorPageCommand { get; set; }
        public ICommand LogoutCommand { get; set; }
        
        public RolesPageViewModel(PageService pageService)
        {
            var useRoles = Login.Login.UserRoles;
            StudentNumber = useRoles[0];
            CollectorId = useRoles[1];
            _pageService = pageService;
            StudentPageCommand = new Command(async () => await _pageService.PushAsync(new StudentHomePage(StudentNumber)));
            CollectorPageCommand = new Command( async () => await _pageService.PushAsync(new CollectorHomePage(CollectorId)));
            LogoutCommand = new Command(async () =>
            {
                Authentication.Authentication.RemoveCredentials();
                await _pageService.PushAsync(new View.Login());
            });
        }

        
        
    }
}