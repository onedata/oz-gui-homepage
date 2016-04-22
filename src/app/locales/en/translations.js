import baseTranslations from './base';
import homepageTranslations from './homepage';

// deep merge
export default $.extend(true, baseTranslations, homepageTranslations);
