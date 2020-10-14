using System;
using SRA.Api;
using SRA.Api.ExceptionsHandlers;
using SRA.Model.Users;
using SRA.Resx;
using SRA.Utils;
using SRA.View;
using Xamarin.Forms;

namespace SRA.Login
{
    public static class Login
    {
        private static IPageService _pageService = new PageService();
        private static WebApi api = (WebApi) Application.Current.Properties[Constants.WebApiProperty];
        
        private static Users UserInfo { get; set; }
        public static int[] UserRoles { get; set; }

        public static bool HasMoreThanOneRole { get; set; }
        
        /// <summary>
        /// Check if there is already login, if there are credentials stored.
        /// </summary>
        public static async void CheckIfIsAlreadyLogin()
        {
            var credentials = await Authentication.Authentication.GetStoreCredentials();
            if(credentials == null) return;
            if (UserInfo == null)
            {
                var splitCredentials = credentials.Split(':');
                try
                {
                    UserInfo = await api.Login(splitCredentials[0], splitCredentials[1]);
                }catch (Exception e)
                {
                    if (e is NoSuccessfulResponseException || e is ApiNotAvailableException)
                    {
                        Authentication.Authentication.RemoveCredentials();
                        await _pageService.PushAsync(new View.Login());
                    }
                }
            }
            EnterAccordingRole();
        }

        /// <summary>
        /// Do the login operation to obtain the user roles in the system
        /// </summary>
        /// <param name="email">user email</param>
        /// <param name="password">user password</param>
        public static async void DoLogin(string email, string password)
        {
            try
            {
                UserInfo = await api.Login(email, password);
                Authentication.Authentication.StoreCredentials(email, password);
                EnterAccordingRole();
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
        /// Redirects the user to a screen base on his role in the system
        /// </summary>
        private static async void EnterAccordingRole()
        {
            var userNumber = 0;
            if ((userNumber = CheckIfIsStudent(UserInfo)) != -1)
            {
                HasMoreThanOneRole = false;
                await _pageService.PushAsync(new StudentHomePage(userNumber));
                return;
            }
            if ((userNumber = CheckIfIsCollector(UserInfo)) != -1)
            {
                HasMoreThanOneRole = false;
                await _pageService.PushAsync(new CollectorHomePage(userNumber));
                return;
            }
            int [] usersNumbers = null;
            if ((usersNumbers = CheckIfIsStudentAndCollector(UserInfo)) != null)
            {
                HasMoreThanOneRole = true;
                UserRoles = usersNumbers;
                await _pageService.PushAsync(new RolesPage());
            }
            else
            {
                await _pageService.DisplayAlert(AppResources.NoRoleAvailable, AppResources.AdminMessage, AppResources.OkMessage);
            }
        }
        
        /// <summary>
        /// Checks if the user as student role
        /// </summary>
        /// <param name="userRoles">user roles in the system</param>
        /// <returns></returns>
        private static int CheckIfIsStudent(Users userRoles)
        {
            if (userRoles.StudentInformation != null && userRoles.CollectorInformation == null)
                return userRoles.StudentInformation.StudentNumber;
            return -1;
        }
        
        /// <summary>
        /// Checks if the user as collector role
        /// </summary>
        /// <param name="userRoles">user roles in the system</param>
        /// <returns></returns>
        private static int CheckIfIsCollector(Users userRoles)
        {
            if (userRoles.CollectorInformation != null && userRoles.StudentInformation == null)
                return userRoles.CollectorInformation.CollectorId;
            return -1;
        }
        
        /// <summary>
        /// Check if user as both roles: student and collector
        /// </summary>
        /// <param name="usersRoles">user roles in the system</param>
        /// <returns>different roles identifiers</returns>
        private static int[] CheckIfIsStudentAndCollector(Users usersRoles)
        {
            if (usersRoles.StudentInformation != null && usersRoles.CollectorInformation != null)
                return new [] {usersRoles.StudentInformation.StudentNumber, usersRoles.CollectorInformation.CollectorId};
            return null;
        } 
    }
}