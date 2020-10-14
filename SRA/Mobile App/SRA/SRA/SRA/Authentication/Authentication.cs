using System;
using System.Text;
using System.Threading.Tasks;
using SRA.Utils;
using Xamarin.Essentials;
using Xamarin.Forms;

namespace SRA.Authentication
{
    /// <summary>
    /// Class that interacts with Secure storage from Xamarin.Essentials
    /// </summary>
    public static class Authentication
    {
        /// <summary>
        /// Get the credentials stored
        /// </summary>
        /// <returns>the credentials in base 64</returns>
        public static async Task<string> GetStoreCredentials()
        {
            try
            {
                return await SecureStorage.GetAsync(Constants.Token);
            }
            catch (Exception ex)
            {
                // Possible that device doesn't support secure storage on device.
            }
            return null;
        }
        
        /// <summary>
        /// Stores in Secure Storage the credentials obtain when login with key token
        /// </summary>
        /// <param name="email">user email</param>
        /// <param name="password">user password</param>
        public static async void StoreCredentials(string email, string password)
        {
            try
            {
                await SecureStorage.SetAsync(Constants.Token, $"{email}:{password}");
            }
            catch (Exception ex)
            {
                // Possible that device doesn't support secure storage on device.
            }
        }
        
        /// <summary>
        /// When logout removes the stored credentials
        /// </summary>
        public static void RemoveCredentials()
        {
            SecureStorage.Remove(Constants.Token);
        }
    }
}