using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SRA.Utils;
using SRA.ViewModel;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace SRA.View
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class RolesPage : ContentPage
    {
        public RolesPageViewModel ViewModel
        {
            get => BindingContext as RolesPageViewModel;
            set => BindingContext = value;
        }
        
        public RolesPage()
        {
            InitializeComponent();
            NavigationPage.SetHasBackButton(this, false);
            ViewModel = new RolesPageViewModel(new PageService());
        }
    }
}