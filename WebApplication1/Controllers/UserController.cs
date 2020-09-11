using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication1.Models;
using WebApplication1.Filters;
namespace WebApplication1.Controllers
{

	public class UserController : Controller
	{
		DreamsEntities _db = null;
		void CheckConnection()
		{
			if (_db == null)
			{
				_db = new DreamsEntities();
			}
		}

		public const int RecordsPerPage = 6;

		public UserController()
		{
			ViewBag.RecordsPerPage = RecordsPerPage;
		}

		[LoginFilter]
		public ActionResult Dreams()
		{
			return RedirectToAction("GetDreams");
		}
		[LoginFilter]
		public ActionResult GetDreams(int? pageNum)
		{
			CheckConnection();
			pageNum = pageNum ?? 0;
			ViewBag.IsEndOfRecords = false;

			if (Request.IsAjaxRequest())
			{
				var dreams = GetRecordsForPage(pageNum.Value);
				ViewBag.IsEndOfRecords = (dreams.Any()) && ((pageNum.Value * RecordsPerPage) >= dreams.Last().Key);
				return PartialView("_UserDreams", dreams);
			}
			else
			{
				LoadAllDreams();
				ViewBag.Dreams = GetRecordsForPage(pageNum.Value);
				return View("Dreams");
			}
		}

		public void LoadAllDreams()
		{
			CheckConnection();

			string username = Convert.ToString(Session["User"]);
			int id = _db.Users.Where(x => x.UserName == username).Select(e => e.ID).FirstOrDefault();
			Session["UserId"] = id;

			var dreams = _db.Dreams.Where(x => x.UserID == id).OrderByDescending(e => e.CreateDate).ToList();

			int dreamIndex = 1;
			HttpContext.Cache["Dreams"] = dreams.ToDictionary(x => dreamIndex++, x => x);
			ViewBag.TotalNumberDreams = dreams.Count();
		}

		public Dictionary<int, Dream> GetRecordsForPage(int pageNum)
		{
			Dictionary<int, Dream> _dreams = (HttpContext.Cache["Dreams"] as Dictionary<int, Dream>);

			int from = (pageNum * RecordsPerPage);
			int to = from + RecordsPerPage;

			return _dreams
				.Where(x => x.Key > from && x.Key <= to)
				.OrderBy(x => x.Key)
				.ToDictionary(x => x.Key, x => x.Value);
		}

		[LoginFilter]
		public ActionResult Details(int id)
		{
			CheckConnection();
			return View(_db.Dreams.Find(id));
		}


		public ActionResult ShowDreams(int? pageNum, int id)
		{
			Session["usId"] = id;
			CheckConnection();
			pageNum = pageNum ?? 0;
			ViewBag.IsEndOfRecords = false;

			if (Request.IsAjaxRequest())
			{
				var dreams = GetDreamsForPage(pageNum.Value);
				ViewBag.IsEndOfRecords = (dreams.Any()) && ((pageNum.Value * RecordsPerPage) >= dreams.Last().Key);
				return PartialView("_Dreams", dreams);
			}
			else
			{
				LoadUsersAllDreams();
				ViewBag.Dreams = GetDreamsForPage(pageNum.Value);
				return View("ShowDreams");
			}
		}



		public void LoadUsersAllDreams()
		{
			CheckConnection();
			int id = Convert.ToInt32(Session["usId"]);
			string name = _db.Users.Where(x => x.ID == id).Select(e => e.UserName).FirstOrDefault();
			ViewBag.username = name;

			var dreams = _db.Dreams.Where(x => x.UserID == id && x.isPublic == true).OrderByDescending(e => e.CreateDate).ToList();

			var dataFinal = new List<DreamViewModel>();
			foreach (var dream in dreams)
			{
				var dreamcustom = new DreamViewModel()
				{
					Id = dream.ID,
					UserID = dream.UserID,
					Title = dream.Title,
					Description = dream.Description,
					CreateDate = dream.CreateDate,
					Categories = dream.DreamAndCategories.Select(e => e.Category.Name).ToList(),
					CategoryIcon = dream.DreamAndCategories.First().Category.Icon,
					Tags = dream.DreamAndTags.Select(e => e.Tag.Name).ToList()
				};
				dataFinal.Add(dreamcustom);
			}


			int dreamIndex = 1;
			HttpContext.Cache["Dreams"] = dataFinal.ToDictionary(x => dreamIndex++, x => x);
			ViewBag.TotalNumberDreams = dataFinal.Count();
		}

		public Dictionary<int, DreamViewModel> GetDreamsForPage(int pageNum)
		{
			Dictionary<int, DreamViewModel> _dreams = (HttpContext.Cache["Dreams"] as Dictionary<int, DreamViewModel>);

			int from = (pageNum * RecordsPerPage);
			int to = from + RecordsPerPage;

			return _dreams
				.Where(x => x.Key > from && x.Key <= to)
				.OrderBy(x => x.Key)
				.ToDictionary(x => x.Key, x => x.Value);
		}

	}
}

