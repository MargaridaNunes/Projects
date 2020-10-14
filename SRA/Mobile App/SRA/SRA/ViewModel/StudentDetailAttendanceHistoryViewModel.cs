using System.Windows.Input;
using SRA.Model;
using SRA.Utils;
using SRA.View;
using Xamarin.Forms;

namespace SRA.ViewModel
{
    public class StudentDetailAttendanceHistoryViewModel
    {
        private IPageService _pageService;
        public StudentLecture StudentLecture { get; set; }
        public ICommand RolesCommand { get; set; }
        
        public StudentDetailAttendanceHistoryViewModel(PageService pageService, StudentLecture studentLecture)
        {
            _pageService = pageService;
            StudentLecture = studentLecture;
            RolesCommand = new Command(async () => await _pageService.PushAsync(new RolesPage()));
        }
    }
}