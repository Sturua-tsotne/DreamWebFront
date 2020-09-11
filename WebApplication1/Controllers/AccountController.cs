using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication1.Models;
using WebApplication1.Helpers;
using WebApplication1.Validators;
using WebApplication1.Filters;
using System.Globalization;

namespace WebApplication1.Controllers
{
    public class AccountController : Controller
    {
        DreamsEntities _db = null;
        void CheckConnection()
        {
            if (_db == null)
            {
                _db = new DreamsEntities();
            }
        }

        // GET: Account
        public ActionResult SignIn()
        {
            return View();
        }

        [HttpPost]
        public JsonResult SignIn(Login log)
        {
            CheckConnection();
            MD5Helper MD5 = new MD5Helper();
            string userpass = MD5.ToMD5(log.Password+secret);

            User us = _db.Users.Where(x => x.Email == log.Email.ToLower() && x.Password ==userpass).FirstOrDefault();

            if (string.IsNullOrWhiteSpace(log.Email) || string.IsNullOrWhiteSpace(log.Password))
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            else if (us == null)
            {
                return Json(2, JsonRequestBehavior.AllowGet);
            }
            Session["User"] = us.UserName;

            return Json(0, JsonRequestBehavior.AllowGet);
        }


        public ActionResult LogOut()
        {
            Session.Clear();
            return Redirect("/Home/Index");
        }

        public ActionResult Forgot()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Forgot(string Email)
        {
            CheckConnection();
            User user = _db.Users.Where(x => x.Email == Email.ToLower()).FirstOrDefault();

            if (user == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            string body = "პაროლის აღსადგენად გთხოვთ გადახვიდეთ <a href=\"http://localhost:2080/Account/Recovery/" + user.Secret + "\">ბმულზე</a>";
            MailSender.SendMail(user.Email, "Recovery", body, true);

            return Json(0, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Recovery(string id)
        {
            CheckConnection();
            int userid = _db.Users.Where(x => x.Secret == id).Select(x => x.ID).FirstOrDefault();
            Session["userid"] = userid;

            return View();
        }

        [HttpPost]
        public JsonResult Recovery(string NewPassword, string ConfirmNewPassword)
        {
            if (String.IsNullOrWhiteSpace(NewPassword) || String.IsNullOrWhiteSpace(ConfirmNewPassword))
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            else if (NewPassword.Length<6)
            {
                return Json(2, JsonRequestBehavior.AllowGet);
            }
            else if (NewPassword != ConfirmNewPassword)
            {
                return Json(3, JsonRequestBehavior.AllowGet);
            }
            CheckConnection();
            MD5Helper MD5 = new MD5Helper();
            int id = Convert.ToInt32(Session["userid"]);
            var us = _db.Users.Where(x => x.ID == id).FirstOrDefault();
            us.Password = MD5.ToMD5(NewPassword + secret);
            us.Secret = Random32();
            _db.SaveChanges();

            return Json(0, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Registration()
        {
            if (Session["User"] == null)
            {
                return View();
            }
            else
            {
                return Redirect("/Home/Index");
            }
        }

        [HttpPost]
        public JsonResult Registration(Registration model)
        {
            CheckConnection();

            var lang = CultureInfo.CurrentCulture.Name;
            var langName = CultureInfo.CurrentCulture.EnglishName;

            if (!model.IsFbUser)
            {
                int UserName_count = _db.Users.Where(x => x.UserName == model.UserName).Count();
                var email = _db.Users.Where(x => x.isFbUser == false).ToList();
                int Email_count = email.Where(x => x.Email == model.Email.ToLower()).Count();

                if (string.IsNullOrWhiteSpace(model.UserName) || string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password) || string.IsNullOrWhiteSpace(model.ConfirmPassword))
                {
                    return Json(1, JsonRequestBehavior.AllowGet);
                }
                else if (model.Password.Length < 6)
                {
                    return Json(2, JsonRequestBehavior.AllowGet);
                }
                else if (model.Password != model.ConfirmPassword)
                {
                    return Json(3, JsonRequestBehavior.AllowGet);
                }
                else if (!EmailValidator.IsValidEmail(model.Email))
                {
                    return Json(4, JsonRequestBehavior.AllowGet);
                }
                else if (Email_count > 0)
                {
                    return Json(5, JsonRequestBehavior.AllowGet);
                }
                else if (UserName_count > 0)
                {
                    return Json(6, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    checkLanguage();
                    string conf = Random32();
                    MD5Helper MD5 = new MD5Helper();
                    Unconfirmed_Users un_user = new Unconfirmed_Users()
                    {
                        Username = model.UserName,
                        Email = model.Email.ToLower(),
                        Password = MD5.ToMD5(model.Password + secret),
                        ConfirmationCode = conf,
                        Lang=lang,
                        CreteDate = DateTime.Now
                    };
                    _db.Unconfirmed_Users.Add(un_user);
                    _db.SaveChanges();
                    
                    string body = "გასააქტიურებლად გთხოვთ გადახვიდეთ <a href='http://localhost:2080/Account/Confirmation/" + conf + "'target='_blank' >ბმულზე</a>";
                    MailSender.SendMail(model.Email, "confirmation", body, true);

                }

                return Json(0, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var Fb_email = _db.Users.Where(x => x.isFbUser == true).ToList();
                int Fb_Email_count = Fb_email.Where(x => x.Email == model.Email.ToLower()).Count();
                if (Fb_Email_count > 0)
                {
                    Session["User"] = model.UserName;
                    return Json("", JsonRequestBehavior.AllowGet);
                }
                else
                {
                    checkLanguage();
                    _db.Users.Add(new User()
                    {
                        Email = model.Email,
                        UserName = model.UserName,
                        isFbUser = true,
                        Lang=lang,
                        CreateDate=DateTime.Now
                    });
                    _db.SaveChanges();
                    Session["User"] = model.UserName;
                    return Json("", JsonRequestBehavior.AllowGet);
                }
            }
        }

        public ActionResult Registered()
        {
            return View();
        }

        public ActionResult Confirmation(string id)
        {
            CheckConnection();
            Unconfirmed_Users user = _db.Unconfirmed_Users.Where(x => x.ConfirmationCode == id).FirstOrDefault();

            _db.Users.Add(new User()
            {
                UserName = user.Username,
                Email = user.Email,
                Password = user.Password,
                Secret = Random32(),
                isFbUser = false,
                Lang=user.Lang,
                CreateDate=DateTime.Now,
            });
            _db.SaveChanges();

            _db.Unconfirmed_Users.RemoveRange(_db.Unconfirmed_Users.Where(x => x.Email == user.Email));
            _db.SaveChanges();

            return View();
        }

        public static string Random32()
        {
            return Guid.NewGuid().ToString("N");
        }

        string secret = "63TdIJPncdaScOAcOGcJ";

       private void checkLanguage()
       {
            var lang = CultureInfo.CurrentCulture.Name;
            var langName = CultureInfo.CurrentCulture.EnglishName;
            if (_db.Languages.Find(lang) == null)
            {
                _db.Languages.Add(new Language
                {
                    LangCode = lang,
                    Name = langName
                });
                _db.SaveChanges();
            }
        }
    }
}