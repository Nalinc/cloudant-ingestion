var config= {};

config.cloudantUrl = "https://nalinc.cloudant.com/";
config.cloudantDB = "test";
config.cloudantKey = "bmFsaW5jOmI0enoxbmc0";

config.documentPath = "./data/";

config.designDocument = "imgbook";
config.analyzer = "standard";
config.language = "english";
config.searchIndex = "function (doc) {\
  index('content', doc.content['raw'],{'index':true,'store':true});\
  index('product-name', doc.content['title'],{'index':false,'store':true});\
  index('chapter-name', doc.imgbook['parent-breadcrumb'],{'index':false,'store':true});\
  index('section-name', doc.imgbook['item-name'],{'index':false,'store':true});\
  index('page-number', doc.imgbook['page-number'],{'index':false,'store':true});\
  index('thumbnail', doc.imgbook['thumbnail'],{'index':false,'store':true});\
  index('org-id', doc.context['org-id'],{'index':true, 'store':false});\
  index('product-id', doc.context['product-id'],{'index':true, 'store':false});\
}";

module.exports = config; 