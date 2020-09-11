using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication1.Models;
using System.Web.Caching;
using WebApplication1.Filters;

namespace WebApplication1.Controllers
{
	public class DreamsController : Controller
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

		public DreamsController()
		{
			ViewBag.RecordsPerPage = RecordsPerPage;
		}

		public ActionResult Index()
		{
			return RedirectToAction("GetDreams");
		}

		public ActionResult GetDreams(int? pageNum)
		{
			CheckConnection();
			pageNum = pageNum ?? 0;
			ViewBag.IsEndOfRecords = false;

			if (Request.IsAjaxRequest())
			{
				var dreams = GetRecordsForPage(pageNum.Value);
				ViewBag.IsEndOfRecords = (dreams.Any()) && ((pageNum.Value * RecordsPerPage) >= dreams.Last().Key);
				return PartialView("_Dreams", dreams);
			}
			else
			{
				LoadAllDreams();
				ViewBag.Dreams = GetRecordsForPage(pageNum.Value);
				return View("Index");
			}
		}
		public void LoadAllDreams()
		{
			CheckConnection();
			var dreams = _db.Dreams.Where(x => x.isPublic == true).OrderByDescending(x => x.CreateDate).ToList();

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
					CategoryIcon= dream.DreamAndCategories.First().Category.Icon,
					Tags = dream.DreamAndTags.Select(e => e.Tag.Name).ToList()
				};
				dataFinal.Add(dreamcustom);
			}


			int dreamIndex = 1;
			HttpContext.Cache["Dreams"] = dataFinal.ToDictionary(x => dreamIndex++, x => x);
			ViewBag.TotalNumberDreams = dataFinal.Count();
		}

		public Dictionary<int, DreamViewModel> GetRecordsForPage(int pageNum)
		{
			Dictionary<int, DreamViewModel> _dreams = (HttpContext.Cache["Dreams"] as Dictionary<int, DreamViewModel>);

			int from = (pageNum * RecordsPerPage);
			int to = from + RecordsPerPage;

			return _dreams
				.Where(x => x.Key > from && x.Key <= to)
				.OrderBy(x => x.Key)
				.ToDictionary(x => x.Key, x => x.Value);
		}


		public ActionResult Details(int id)
		{
			CheckConnection();
			var dream = _db.Dreams.Find(id);

			var user = new UserCustom()
			{
				UserName = dream.User.UserName,
				Id = dream.UserID
			};
			ViewBag.user = user;
			return View(_db.Dreams.Find(id));
		}


		[LoginFilter]
		public ActionResult AddDreams()
		{
			CheckConnection();
			int User_Id = Convert.ToInt32(Session["UserId"]);
			var lang = _db.Users.Where(x => x.ID == User_Id).Select(e => e.Lang).FirstOrDefault();
			ViewBag.userLang = lang;
			return View();
		}


		[ValidateInput(false)]
		[HttpPost]
		public JsonResult AddDreams(DreamCustom model)
		{
			CheckConnection();

			if (ModelState.IsValid)
			{
				int User_Id = Convert.ToInt32(Session["UserId"]);
				var dream = new Dream();
				dream.Title = model.Title;
				dream.Description = model.Description;
				dream.Lat = model.Lat;
				dream.Long = model.Long;
				dream.RealLat = model.Lat;
				dream.RealLong = model.Long;
				dream.isPublic = model.isPublic;
				dream.CreateDate = model.CreateDate;
				dream.UserID = User_Id;
				dream.Lang = model.Lang;
				foreach (var cat in model.Categories)
				{
					dream.DreamAndCategories.Add(new DreamAndCategory() { CategoryID = cat });
				}
				foreach (var tag in model.Tags)
				{
					var _tag = _db.Tags.Add(new Tag() { Name = tag });
					dream.DreamAndTags.Add(new DreamAndTag() { Tag = _tag });
				}
				_db.Dreams.Add(dream);
				_db.SaveChanges();
				return Json(true, JsonRequestBehavior.AllowGet);
			}
			else
			{
				var errors = ModelState.Select(x => x.Value.Errors.Select(e => e.ErrorMessage));
				return Json(errors, JsonRequestBehavior.AllowGet);
			}
		}

		[LoginFilter]
		[HttpPost]
		public JsonResult Delete(int Id)
		{
			CheckConnection();
			var dream = _db.Dreams.Find(Id);

			var dreamandcats = dream.DreamAndCategories.ToArray();
			foreach (var cat in dreamandcats)
			{
				_db.DreamAndCategories.Remove(cat);
			}
			var dreamandtags = dream.DreamAndTags.ToArray();
			foreach (var tag in dreamandtags)
			{
				_db.DreamAndTags.Remove(tag);
				var realTag = _db.Tags.Where(t => t.ID == tag.TagID).First();
				_db.Tags.Remove(realTag);
			}

			_db.Dreams.Remove(dream);
			_db.SaveChanges();
			return Json(true, JsonRequestBehavior.AllowGet);
		}

		[LoginFilter]
		public ActionResult Edit(int id)
		{
			CheckConnection();
			var dreams = _db.Dreams.Find(id);

			List<int> selectedCategories = new List<int>();
			foreach (var cat in dreams.DreamAndCategories)
			{
				selectedCategories.Add(cat.Category.ID);
			}
			ViewBag.cats = selectedCategories;
			return View(dreams);
		}

		[ValidateInput(false)]
		[HttpPost]
		public JsonResult Edit(DreamCustom model)
		{
			if (ModelState.IsValid)
			{
				CheckConnection();
				Dream dreams = _db.Dreams.Where(x => x.ID == model.Id).FirstOrDefault();
				dreams.Title = model.Title;
				dreams.Description = model.Description;
				dreams.CreateDate = model.CreateDate;
				dreams.Lat = model.Lat;
				dreams.Long = model.Long;
				dreams.isPublic = model.isPublic;
				dreams.Lang = model.Lang;

				_db.DreamAndCategories.RemoveRange(_db.DreamAndCategories.Where(x => x.DreamID == dreams.ID));
				foreach (var cat in model.Categories)
				{
					dreams.DreamAndCategories.Add(new DreamAndCategory() { CategoryID = cat });
				}
				foreach (var tagId in _db.DreamAndTags.Where(x => x.DreamID == dreams.ID).Select(x => x.TagID))
				{
					_db.Tags.Find(tagId);
					_db.Tags.Remove(_db.Tags.Find(tagId));
				}
				_db.DreamAndTags.RemoveRange(_db.DreamAndTags.Where(x => x.DreamID == dreams.ID));

				foreach (var tag in model.Tags)
				{
					var _tag = _db.Tags.Add(new Tag() { Name = tag });
					dreams.DreamAndTags.Add(new DreamAndTag() { Tag = _tag });
				}

				_db.SaveChanges();
				return Json(true, JsonRequestBehavior.AllowGet);
			}
			else
			{
				var errors = ModelState.Select(x => x.Value.Errors.Select(e => e.ErrorMessage));
				return Json(errors, JsonRequestBehavior.AllowGet);
			}
		}

		public ActionResult Search()
		{
			CheckConnection();

			var dreams = _db.Dreams.Where(x => x.isPublic == true).OrderByDescending(x => x.CreateDate).ToList();

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
			return View(dataFinal);
		}

		public PartialViewResult FilterDreamsData(string[] texts, string[] tags,string[] langs, int[] categories, DateTime? startDate, DateTime? endDate)
		{
			CheckConnection();
			var dreams = new List<Dream>();

			if (categories != null)
			{
				dreams = _db.Dreams.Where(e => e.DreamAndCategories.Any(x => categories.Contains(x.CategoryID))).ToList();
				dreams = dreams.Where(e => e.isPublic).ToList();
				if (dreams.Count == 0) return PartialView("_PartialFilterData", DreamConverter(dreams));
			}


			
			if (tags != null)
			{
				if (dreams.Any())
				{
					dreams = dreams.Where(e => e.DreamAndTags.Any(x => tags.Select(t=>t.ToLower()).Contains(x.Tag.Name.ToLower()))).ToList();
				}
				else
				{
					dreams = _db.Dreams.Where(e => e.DreamAndTags.Any(x => tags.Select(t => t.ToLower()).Contains(x.Tag.Name.ToLower()))).ToList();
				}
				dreams = dreams.Where(e => e.isPublic).ToList();
				if (dreams.Count == 0) return PartialView("_PartialFilterData", DreamConverter(dreams));
			}

			

			if(langs!=null)
			{
				if (dreams.Any())
				{
					dreams = dreams.Where(e => langs.Contains(e.Lang)).ToList();
				}
				else
				{
					dreams= _db.Dreams.Where(e => langs.Contains(e.Lang)).ToList();
				}
				dreams = dreams.Where(e => e.isPublic).ToList();
				if (dreams.Count == 0) return PartialView("_PartialFilterData", DreamConverter(dreams));
			}

			

			if(texts!=null)
			{
				List<Dream> tempDreams = new List<Dream>(); ;
				if (dreams.Any())
				{
					foreach (var text in texts)
					{
						tempDreams.AddRange(dreams.Where(e => e.Title.ToLower().Contains(text.ToLower()) || e.Description.ToLower().Contains(text.ToLower()) || e.User.UserName.ToLower().Contains(text.ToLower())).ToList());
					}
				}
				else
				{
					foreach (var text in texts)
					{
						tempDreams.AddRange(_db.Dreams.Where(e => e.Title.ToLower().Contains(text.ToLower()) || e.Description.ToLower().Contains(text.ToLower()) || e.User.UserName.ToLower().Contains(text.ToLower())).ToList());
					}

				}
				dreams = tempDreams;
				dreams = dreams.Where(e => e.isPublic).ToList();
				if (dreams.Count == 0) return PartialView("_PartialFilterData", DreamConverter(dreams));
			}


			if (dreams.Any())
			{
				if (startDate != null && endDate != null)
				{
					dreams = dreams.Where(e => e.CreateDate >= startDate && e.CreateDate <= endDate).ToList();
				}
				else if (startDate != null)
				{
					dreams = dreams.Where(e => e.CreateDate >= startDate).ToList();
				}
				else if (endDate != null)
				{
					dreams = dreams.Where(e => e.CreateDate <= endDate).ToList();
				}
			}
			else
			{
				if (startDate != null && endDate != null)
				{
					dreams = _db.Dreams.Where(e => e.CreateDate >= startDate && e.CreateDate <= endDate).ToList();
				}
				else if (startDate != null)
				{
					dreams = _db.Dreams.Where(e => e.CreateDate >= startDate).ToList();
				}
				else if (endDate != null)
				{
					dreams = _db.Dreams.Where(e => e.CreateDate <= endDate).ToList();
				}
			}
			dreams = dreams.Where(e => e.isPublic).ToList();
			return PartialView("_PartialFilterData", DreamConverter(dreams));

		}


		private List<DreamViewModel> DreamConverter(List<Dream> dreams)
		{
			return dreams.Select(dream => new DreamViewModel
			{
				Id = dream.ID,
				UserID = dream.UserID,
				Title = dream.Title,
				Description = dream.Description,
				CreateDate = dream.CreateDate,
				Categories = dream.DreamAndCategories.Select(e => e.Category.Name).ToList(),
				CategoryIcon = dream.DreamAndCategories.First().Category.Icon,
				Tags = dream.DreamAndTags.Select(e => e.Tag.Name).ToList()
			}).ToList();
		}

	}
}
