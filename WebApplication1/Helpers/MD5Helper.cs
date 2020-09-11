using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Security.Cryptography;

namespace WebApplication1.Helpers
{
    public class MD5Helper
    {
        public string ToMD5(string value)
        {
            MD5 md = MD5.Create();
            byte[] valuebytes = System.Text.Encoding.ASCII.GetBytes(value);
            byte[] hash = md.ComputeHash(valuebytes);
            StringBuilder sb = new StringBuilder();

            for (int i = 0; i < hash.Length; i++)
            {
                sb.Append(hash[i].ToString("X2"));
            }

            return sb.ToString();


        }
    }
}