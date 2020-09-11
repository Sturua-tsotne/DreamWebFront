using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Helpers
{
    public class MailSender
    {
        public static bool SendMail(string userMail, string subject, string body, bool isHtml = false)
        {
            try
            {
                System.Net.Mail.MailMessage mail = new System.Net.Mail.MailMessage();
                mail.IsBodyHtml = isHtml;
                mail.From = new System.Net.Mail.MailAddress("vaso.kurtsadze@geolab.edu.ge"); 
                mail.To.Add(userMail);
                mail.Subject = subject;
                mail.Body = body;

                System.Net.Mail.SmtpClient SmtpServer = new System.Net.Mail.SmtpClient("in-v3.mailjet.com");
                SmtpServer.Port = 587; 
                SmtpServer.Credentials = new System.Net.NetworkCredential("4dea260116577af0288be57bbe3e2dcc", "10f9d20b16c7f32eab700a8131ea7b5a");
                SmtpServer.EnableSsl = false;

                SmtpServer.Send(mail);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}